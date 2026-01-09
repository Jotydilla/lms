import User from "../../models/User.js";
import VerificationSession from "../../models/VerificationSession.js";
export const getResetPassword = async (c) => {
  try {
    const verifyId = c.req.param("verifyId");
    const verification = await VerificationSession.findOne({
      where: { verifyId },
      include: [{ model: User }],
    });

    if (!verification.purpose === "password_reset")
      return c.json({ message: "Unauthorized" });

    if (!verification || verification.expiresAt < new Date())
      return c.json({ message: "Unauthorized!!" }, 500);

    if (!verification.isVerified)
      return c.json({ message: "Unauthorized" }, 500);

    return c.json({ data: verification }, 200);
  } catch (error) {
    console.error(error);
    return c.text("Internal server error", 500);
  }
};
