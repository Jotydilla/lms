import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Op } from "sequelize";
import User from "../../models/User.js";
import userSession from "../../models/userSession.js";
import crypto from "crypto";

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
    const { phone, password } = await c.req.json();

    if (!phone || !/^[0-9]{9,15}$/.test(phone))
      return c.json({ error: "Invalid phone" }, 400);
    if (!password || password.trim() === "")
      return c.json({ error: "Password required" }, 400);

    const user = await User.findOne({ where: { phone } });
    if (!user) return c.json({ error: "Incorrect phone or password" }, 401);

    if (!user.is_verified)
      return c.json({ error: "Account not verified" }, 403);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return c.json({ error: "Incorrect phone or password" }, 401);

    if (user.status !== "active")
      return c.json({ error: "Account not active" }, 403);

    // --- JWT Tokens ---
    const accessToken = jwt.sign({ id: user.publicId }, secret, {
      expiresIn: "1h",
      algorithm: "HS256",
    });
    const refreshToken = jwt.sign({ id: user.publicId }, refreshSecret, {
      expiresIn: "30d",
      algorithm: "HS256",
    });

    await user.update({ lastLogin: new Date() });

    const fingerprint = generateFingerprint(c);
    const deviceId = c.req.header("X-Device-ID") || "";
    const deviceName = c.req.header("X-Device-Name") || "";
    const ip =
      c.req.header("X-Forwarded-For") || c.req.raw?.conn?.remoteAddress || "";

    // Revoke old sessions if more than MAX_DEVICES
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

    // ✅ Set HttpOnly cookies
    c.header("Set-Cookie", [
      `accessToken=${accessToken}; HttpOnly; Path=/; Max-Age=3600; SameSite=None`,
      `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=None`,
    ]);

    return c.json({ message: "Login successful", id: user.publicId }, 200);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
