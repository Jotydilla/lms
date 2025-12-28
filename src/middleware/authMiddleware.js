import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();
const secret = process.env.SECRET;

export const authMiddleware = async (c, next) => {
  try {
    const accessToken = c.req.cookie("accessToken");

    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!secret) {
      console.error("JWT secret not defined");
      return c.json({ error: "Server misconfiguration" }, 500);
    }

    const decoded = jwt.verify(accessToken, secret, {
      algorithms: ["HS256"],
    });

    const user = await User.findOne({
      where: { publicId: decoded.id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    c.set("user", user);

    await next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return c.json({ error: "Access token expired" }, 401);
    }
    return c.json({ error: "Invalid token" }, 401);
  }
};
