import User from "../../models/User.js";
import VerificationSession from "../../models/VerificationSession.js";
import bcrypt from "bcrypt";

export const resetPassword = async (c) => {
  try {
    const body = await c.req.json();
    const verifyId = c.req.param("verifyId");

    let { password } = body;
    if (!password) {
      return c.json({ message: "password field is required" }, 400);
    }
    if (password.length === 0) {
      return c.json({ message: "Fields cannot be empty" }, 400);
    }
    password = String(password).trim();

    const verification = await VerificationSession.findOne({
      where: { verifyId },
    });
    if (!verification || !verification.isVerified)
      return c.json({ error: "Unauthorized" }, 401);

    const user = await User.findByPk(verification.userId);

    if (!user) return c.json({ error: "User not found" }, 404);

    if (!user.is_verified) return c.json({ message: "user not verified" }, 403);

    if (!verification.purpose === "password_reset")
      return c.json({ message: "Unauthorized" });

    if (verification.expiresAt < new Date())
      return c.json({ error: "OTP expired!!!." }, 400);

    if (!verification.isVerified)
      return c.json({ error: "you otp not verified" }, 400);

    const hashed = await bcrypt.hash(password, 10);

    await user.update({
      password: hashed,
      lastChangePassword: new Date(),
    });

    return c.json({ message: "password reset. You can now log in." }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server Error " }, 500);
  }
};
