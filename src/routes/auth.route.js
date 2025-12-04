import { Hono } from "hono";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyPhone } from "../middleware/verifyPhone.js";

const authRouter = new Hono();

authRouter.get("/", authMiddleware, verifyPhone, (c) => {
  const user = c.get("user");
  return c.json({
    message: `Welcome to your dashboard, ${user.publicId}!`,
  });
});

export default authRouter;
