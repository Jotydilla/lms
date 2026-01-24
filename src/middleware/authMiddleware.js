import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getCookie } from "hono/cookie";
import User from "../models/User.js";

dotenv.config();
const secret = process.env.SECRET;

export const authMiddleware = async (c, next) => {
  try {
    const accessToken = getCookie(c, "accessToken");
    // console.log("Access Token:", accessToken);
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const decoded = jwt.verify(accessToken, secret);

    const user = await User.findOne({
      where: { publicId: decoded.id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    if (["inactive", "banned"].includes(user.status)) {
      return c.json({ error: "Account not active" }, 403);
    }

    c.set("user", user);

    await next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return c.json({ error: "Access token expired" }, 401);
    }

    return c.json({ error: "Invalid token" }, 401);
  }
};
