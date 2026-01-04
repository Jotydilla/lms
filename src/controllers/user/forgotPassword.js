import User from "../../models/User.js";

const generateVerification = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);
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
  if (!user) return c.json({ error: "Phone number  not found" }, 404);

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  if (user.lastChangePassword) {
    const lastChangeMs = new Date(user.lastChangePassword).getTime();
    const sinceLastChange = Date.now() - lastChangeMs;
    if (sinceLastChange < THREE_DAYS_MS) {
      const remainingMs = THREE_DAYS_MS - sinceLastChange;
      const remainingHours = Math.ceil(remainingMs / (1000 * 60 * 60));
      return c.json(
        {
          // error: "Password recently changed",
          message: `You can change your password once every 3 days. Try again in ~  ${remainingHours} hour(s).`,
        },
        403
      );
    }
  }

  if (!user.is_verified)
    return c.json({ warning: "you are not verified not verified" }, 403);

  await user.update({
    verificationCode: code,
    verificationExpires: expires,
  });
  return c.json({ message: " New OTP sent.", id: user.publicId }, 200);
};
