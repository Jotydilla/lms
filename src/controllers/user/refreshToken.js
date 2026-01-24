import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from "sequelize";
import { getCookie, setCookie } from "hono/cookie";
import userSession from "../../models/userSession.js";

dotenv.config();

const secret = process.env.SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

export const refreshToken = async (c) => {
  try {
    const token = getCookie(c, "refreshToken");
    if (!token) {
      return c.json({ error: "No refresh token" }, 401);
    }

    let payload;
    try {
      payload = jwt.verify(token, refreshSecret);
    } catch {
      return c.json({ error: "Invalid or expired refresh token" }, 401);
    }

    const session = await userSession.findOne({
      where: {
        userId: payload.id,
        refreshToken: token,
        isRevoked: false,
        expiresAt: { [Op.gt]: new Date() },
      },
    });

    if (!session) {
      return c.json({ error: "Session expired or revoked" }, 401);
    }
    const newAccessToken = jwt.sign({ id: session.userId }, secret, {
      expiresIn: "1h",
    });

    const newRefreshToken = jwt.sign({ id: session.userId }, refreshSecret, {
      expiresIn: "30d",
    });

    session.refreshToken = newRefreshToken;
    session.lastUsedAt = new Date();
    session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await session.save();

    setCookie(c, "accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60,
    });

    setCookie(c, "refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return c.json({ message: "Token refreshed" });
  } catch (err) {
    console.error("REFRESH ERROR:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
