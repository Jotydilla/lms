import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyPhone = async (c, next) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    if (!user.is_verified) {
      return c.json({ error: "Phone not verified. Please verify OTP." }, 403);
    }
    return next();
  } catch (err) {
    console.error("verifyPhone error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
