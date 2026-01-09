import User from "../../models/User.js";
import VerificationSession from "../../models/VerificationSession.js";

const generateVerification = () => {
  const reCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  return { reCode, expires };
};

export const resendOTPActivation = async (c) => {
  const { phone } = await c.req.json();

  const errors = [];
  if (!phone || !/^[0-9]{9,15}$/.test(phone))
    errors.push("Invalid phone number");
  if (errors.length > 0)
    return c.json({ error: "Validation failed", details: errors }, 400);

  const user = await User.findOne({ where: { phone } });

  const verification = await VerificationSession.findOne({
    where: {
      userId: user.userId,
    },
    order: [["id", "DESC"]],
  });
  if (!verification) return c.json({ message: "Unauthorized!" });

  if (!verification.purpose === "phone_verify")
    return c.json({ message: "Unauthorized" });

  if (!user) return c.json({ error: "User not found" }, 404);

  if (user.is_verified) return c.json({ message: "Already verified" });

  if (new Date() > verification.expiresAt) {
    const { reCode, expires } = generateVerification();
    await verification.update({
      otpHash: reCode,
      expiresAt: expires,
    });
    return c.json({ message: "New OTP sent." }, 200);
  }

  return c.json(
    { message: "wait verfication code was sendind for you!!" },
    500
  );
};
