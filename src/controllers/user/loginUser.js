import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Op } from "sequelize";
import { setCookie } from "hono/cookie";
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

    const accessToken = jwt.sign({ id: user.publicId }, secret, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign({ id: user.publicId }, refreshSecret, {
      expiresIn: "30d",
    });

    await user.update({ lastLogin: new Date() });

    const fingerprint = generateFingerprint(c);
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
      ipAddress: c.req.header("X-Forwarded-For") || "",
      deviceName: c.req.header("X-Device-Name") || "",
      deviceId: c.req.header("X-Device-ID") || "",
      lastUsedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isRevoked: false,
    });

    setCookie(c, "accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60,
    });

    setCookie(c, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return c.json({ message: "Login successful", id: user.publicId }, 200);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
