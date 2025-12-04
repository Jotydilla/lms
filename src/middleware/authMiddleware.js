import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();
const secret = process.env.SECRET;
export const authMiddleware = async (c, next) => {
  const authHeader = c.req.header("Authorization");
  // No Authorization header
  if (!authHeader) {
    return c.json({ error: "No token provided" }, 401);
  }
  // Not "Bearer <token>"
  if (!authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Invalid token format" }, 400);
  }
  const token = authHeader.split(" ")[1];
  // Secret missing
  if (!secret) {
    console.error("JWT secret not defined in environment variables.");
    return c.json({ error: "Server misconfiguration" }, 500);
  }
  try {
    // Decode token
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    // Find user by publicId
    const user = await User.findOne({
      where: { publicId: decoded.id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
    // Store user in context
    c.set("user", user);

    // Continue
    await next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return c.json({ error: "Token expired" }, 401);
    }

    return c.json({ error: "Invalid token" }, 401);
  }
};
