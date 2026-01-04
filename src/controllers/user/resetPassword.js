import User from "../../models/User.js";
import bcrypt from "bcrypt";

const generateVerification = () => {
  const reCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  return { reCode, expires };
};
export const resetPassword = async (c) => {
  try {
    const body = await c.req.json();
    const publicId = c.req.param("publicId");

    let { password } = body;
    if (!password) {
      return c.json({ message: "All fields are required" }, 400);
    }
    if (password.length === 0) {
      return c.json({ message: "Fields cannot be empty" }, 400);
    }
    password = String(password).trim();

    const user = await User.findOne({ where: { publicId } });

    if (!user) return c.json({ error: "User not found" }, 404);

    if (!user.is_verified) return c.json({ message: "user not verified" }, 403);

    if (
      user.verificationExpires &&
      Date.now() > new Date(user.verificationExpires).getTime()
    ) {
      return c.json({ error: "OTP expired. resent new OTP." }, 400);
    }
    const hashed = await bcrypt.hash(password, 10);

    await user.update({
      password: hashed,
      is_verified: true,
      verificationCode: null,
      verificationExpires: null,
      lastChangePassword: new Date(),
    });
    return c.json({ message: "password reset. You can now log in." }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server Error " }, 500);
  }
};
