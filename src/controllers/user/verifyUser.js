import User from "../../models/User.js";

const generateVerification = () => {
  const reCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  return { reCode, expires };
};

export const verifyUser = async (c) => {
  const { phone, code } = await c.req.json();

  const errors = [];
  if (!phone || !/^[0-9]{9,15}$/.test(phone))
    errors.push("Invalid phone number");
  if (!code || !/^[0-9]{6}$/.test(code))
    errors.push("Invalid Verification code");

  if (errors.length > 0)
    return c.json({ error: "Validation failed", details: errors }, 400);

  const user = await User.findOne({ where: { phone } });

  if (!user) return c.json({ error: "User not found" }, 404);

  if (user.is_verified) return c.json({ message: "Already verified" });

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
  // OTP is correct — verify user
  await user.update({
    is_verified: true,
    verificationCode: null,
    verificationExpires: null,
  });
  return c.json({ message: "Phone verified. You can now log in." });
};
