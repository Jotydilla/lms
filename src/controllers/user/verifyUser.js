import User from "../../models/User.js";
import VerificationSession from "../../models/VerificationSession.js";

export const verifyUser = async (c) => {
  const { otp } = await c.req.json();

  const verifyId = c.req.param("verifyId");

  const errors = [];
  if (!otp || !/^[0-9]{6}$/.test(otp)) errors.push("Invalid otp");

  if (errors.length > 0)
    return c.json({ error: "Validation failed", details: errors }, 400);

  const verification = await VerificationSession.findOne({
    where: { verifyId },
  });
  if (!verification) return c.json({ error: "Unauthorized" }, 401);

  if (!verification.purpose === "phone_verify")
    return c.json({ message: "Unauthorized" });

  const user = await User.findByPk(verification.userId);
  if (!user) return c.json({ error: "User not found" }, 404);

  if (user.is_verified) return c.json({ message: "Already verified" });

  if (verification.expiresAt < new Date())
    return c.json({ error: "OTP expired. resend it." }, 400);

  if (verification.attempts >= 5)
    return c.json({ error: "Too many attempts" }, 429);

  if (verification.otpHash !== otp) {
    await verification.increment("attempts", { by: 1 });
    return c.json({ error: "OTP invalid" }, 400);
  }
  await verification.increment("attempts", { by: 1 });
  await verification.update({ isVerified: true });
  await user.update({ is_verified: true });
  return c.json({
    message: "Verified Successfully!!.",
  });
};
