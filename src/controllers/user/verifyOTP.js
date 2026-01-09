import User from "../../models/User.js";
import VerificationSession from "../../models/VerificationSession.js";

export const verifyOTP = async (c) => {
  try {
    const body = await c.req.json();
    let { otp } = body;

    const verifyId = c.req.param("verifyId");

    const errors = [];
    if (!otp || !/^[0-9]{6}$/.test(otp)) errors.push("Invalid Verification");

    if (errors.length > 0)
      return c.json({ error: "Validation failed", details: errors }, 400);

    const verification = await VerificationSession.findOne({
      where: { verifyId },
    });
    if (!verification) return c.json({ error: "Unauthorized" }, 401);

    const user = await User.findByPk(verification.userId);

    if (!user) return c.json({ error: "User not found" }, 404);

    if (!user.is_verified) return c.json({ message: "phone not verified" });

    if (!verification.purpose === "password_reset")
      return c.json({ message: "Unauthorized" });

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

    return c.json(
      {
        message: "verified OTP. now you can create new password.",
        id: verification.verifyId,
      },
      200
    );
  } catch (error) {
    return c.json({ msg: "Internal server Error " });
  }
};
