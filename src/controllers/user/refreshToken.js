import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Op } from "sequelize";
import userSession from "../../models/userSession.js";

dotenv.config();
const secret = process.env.SECRET;
const refreshSecret = process.env.REFRESH_SECRET;

export const refreshToken = async (c) => {
  try {
    const token = c.req.cookie("refreshToken");
    if (!token) return c.json({ error: "No refresh token" }, 401);

    let payload;
    try {
      payload = jwt.verify(token, refreshSecret, {
        algorithms: ["HS256"],
      });
    } catch {
      return c.json({ error: "Invalid or expired refresh token" }, 401);
    }

    const now = new Date();
    const session = await userSession.findOne({
      where: {
        userId: payload.id,
        refreshToken: token,
        isRevoked: false,
        expiresAt: { [Op.gt]: now },
      },
    });

    if (!session) return c.json({ error: "Session expired or revoked" }, 401);

    const newAccessToken = jwt.sign({ id: session.userId }, secret, {
      expiresIn: "1hr",
      algorithm: "HS256",
    });

    const newRefreshToken = jwt.sign({ id: session.userId }, refreshSecret, {
      expiresIn: "30d",
      algorithm: "HS256",
    });

    session.refreshToken = newRefreshToken;
    session.lastUsedAt = new Date();
    session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    await session.save();

    c.header("Set-Cookie", [
      `accessToken=${newAccessToken}; HttpOnly; Path=/; Max-Age=${
        1 * 60 * 60
      }; SameSite=Strict`,
      `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=${
        30 * 24 * 60 * 60
      }; SameSite=Strict`,
    ]);

    return c.json({ message: "Token refreshed" });
  } catch (err) {
    console.error("REFRESH ERROR:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
