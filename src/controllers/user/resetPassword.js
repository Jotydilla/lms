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

    let { code } = body;
    if (!password) {
      return c.json({ message: "All fields are required" }, 400);
    }
    if (password.length === 0) {
      return c.json({ message: "Fields cannot be empty" }, 400);
    }
    password = String(password).trim();

    const errors = [];
    if (!phone || !/^[0-9]{9,15}$/.test(phone))
      errors.push("Invalid phone number");
    if (!code || !/^[0-9]{6}$/.test(code))
      errors.push("Invalid Verification code");

    if (errors.length > 0)
      return c.json({ error: "Validation failed", details: errors }, 400);

    const user = await User.findOne({ where: { phone } });

    if (!user) return c.json({ error: "User not found" }, 404);

    if (!user.is_verified) return c.json({ message: "user not verified" });
    // Wrong code
    if (user.verificationCode !== code) {
      return c.json({ error: "OTP invalid" }, 400);
    }
    // OTP expired
    if (new Date() > user.verificationExpires) {
      const { reCode, expires } = generateVerification();
      await user.update({
        verificationCode: reCode,
        verificationExpires: expires,
      });
      return c.json({ error: "OTP expired. New OTP sent." }, 400);
    }
    const hashed = await bcrypt.hash(password, 10);

    // OTP is correct
    await user.update({
      password: hashed,
      is_verified: true,
      verificationCode: null,
      verificationExpires: null,
    });
    return c.json({ message: "password reset. You can now log in." });
  } catch (error) {
    return c.json({ msg: "Internal server Error " });
  }
};
