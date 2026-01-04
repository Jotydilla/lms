import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Op } from "sequelize";
import User from "../../models/User.js";
import userSession from "../../models/userSession.js";
import crypto from "crypto";
// updated!!

dotenv.config();
const secret = process.env.SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const MAX_DEVICES = 3;

function generateFingerprint(c) {
  const userAgent = c.req.header("User-Agent") || "";
  const deviceId = c.req.header("X-Device-ID") || "";
  return crypto
    .createHash("sha256")
    .update(`${deviceId}|${userAgent}`)
    .digest("hex");
}

export const loginUser = async (c) => {
  try {
    let { phone, password } = await c.req.json();

    const errors = [];
    if (!phone || !/^[0-9]{9,15}$/.test(phone)) errors.push("Invalid phone");
    if (!password || password.trim() === "") errors.push("Password required");
    if (errors.length > 0)
      return c.json({ error: "Validations failed", details: errors }, 400);

    password = String(password).trim();

    if (!secret || !refreshSecret)
      return c.json({ error: "Server config error" }, 500);

    const user = await User.findOne({ where: { phone } });
    if (!user)
      return c.json(
        { error: "You have entered incorrect phone number or password." },
        404
      );

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return c.json(
        { error: "You have entered incorrect phone number or password." },
        401
      );
    // if (!match) return c.json({ error: "Incorrect password" }, 401);

    if (!user.is_verified)
      return c.json({ error: "Account not verified" }, 403);

    if (user.status === "inactive")
      return c.json({ error: "Account inactive" }, 403);

    if (user.status === "banned")
      return c.json({ error: "Account banned" }, 403);

    const accessToken = jwt.sign(
      { id: user.publicId, phone: user.phone },
      secret,
      { expiresIn: "1hr", algorithm: "HS256" }
    );

    const refreshToken = jwt.sign({ id: user.publicId }, refreshSecret, {
      expiresIn: "30d",
      algorithm: "HS256",
    });

    const fingerprint = generateFingerprint(c);
    const deviceId = c.req.header("X-Device-ID") || "";
    const deviceName = c.req.header("X-Device-Name") || "";
    const ip =
      c.req.header("X-Forwarded-For") || c.req.raw?.conn?.remoteAddress || "";

    const now = new Date();
    const activeSessions = await userSession.findAll({
      where: {
        userId: user.publicId,
        isRevoked: false,
        expiresAt: { [Op.gt]: now },
      },
      order: [["lastUsedAt", "ASC"]],
    });

    if (activeSessions.length >= MAX_DEVICES) {
      activeSessions[0].isRevoked = true;
      await activeSessions[0].save();
    }

    await userSession.create({
      userId: user.publicId,
      refreshToken,
      fingerprint,
      userAgent: c.req.header("User-Agent") || "",
      ipAddress: ip,
      deviceName,
      deviceId,
      lastUsedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isRevoked: false,
    });

    // c.header("Set-Cookie", [
    //   `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=${3600}; SameSite=None; Secure`,
    //   `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${
    //     30 * 24 * 60 * 60
    //   }; SameSite=None`,
    // ]);

    c.header("Set-Cookie", [
      `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`,
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${
        30 * 24 * 60 * 60
      }; SameSite=Lax`,
    ]);

    return c.json({ message: "Login successful" });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
