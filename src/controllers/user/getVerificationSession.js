import User from "../../models/User.js";
import VerificationSession from "../../models/VerificationSession.js";

export const getVerificationSession = async (c) => {
  try {
    const verifyId = c.req.param("verifyId");

    const verification = await VerificationSession.findOne({
      where: {
        verifyId,
      },
      include: [{ model: User }],
    });

    if (!verification) return c.json({ message: "Unauthorized!!" }, 500);

    if (verification.isVerified)
      return c.json({ message: "Unauthorized" }, 500);

    if (verification.expiresAt >= new Date())
      return c.json({ data: verification }, 200);

    const ONE_HOUR = 60 * 60 * 1000;
    const oneHourAgo = new Date(Date.now() - ONE_HOUR);

    if (verification.createdAt >= oneHourAgo) {
      return c.json({ data: verification }, 200);
    }
    return c.json({ message: "OTP resend window expired" }, 401);
    // return c.json({ data: verification }, 200);
  } catch (error) {
    console.error(error);
    return c.text("Internal server error", 500);
  }
};
