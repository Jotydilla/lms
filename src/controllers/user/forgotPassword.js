import User from "../../models/User.js";

const generateVerification = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  return { code, expires };
};
export const forgotPassword = async (c) => {
  const { phone } = await c.req.json();
  const { code, expires } = generateVerification();

  const errors = [];
  if (!phone || !/^[0-9]{9,15}$/.test(phone))
    errors.push("Invalid phone number");

  if (errors.length > 0)
    return c.json({ error: "Validation failed", details: errors }, 400);

  const user = await User.findOne({ where: { phone } });
  if (!user) return c.json({ error: "User not found" }, 404);

  if (!user.is_verified) return c.json({ message: "user not verified" });

  await user.update({
    verificationCode: code,
    verificationExpires: expires,
  });
  return c.json({ error: " New OTP sent." }, 400);
};
