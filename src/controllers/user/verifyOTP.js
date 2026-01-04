import User from "../../models/User.js";

const generateVerification = () => {
  const reCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  return { reCode, expires };
};
export const verifyOTP = async (c) => {
  try {
    const body = await c.req.json();
    let { code } = body;

    const publicId = c.req.param("publicId");

    const errors = [];
    if (!code || !/^[0-9]{6}$/.test(code))
      errors.push("Invalid Verification code");

    if (errors.length > 0)
      return c.json({ error: "Validation failed", details: errors }, 400);

    const user = await User.findOne({
      where: { publicId },
    });

    if (!user) return c.json({ error: "User not found" }, 404);

    if (!user.is_verified) return c.json({ message: "user not verified" });

    if (user.verificationCode !== code) {
      return c.json({ error: "Invalid OTP" }, 400);
    }

    if (new Date() > user.verificationExpires) {
      // const { reCode, expires } = generateVerification();
      // await user.update({
      //   verificationCode: reCode,
      //   verificationExpires: expires,
      // });
      return c.json({ error: "OTP expired. Resend it." }, 400);
    }

    await user.update({
      verificationCode: null,
      // verificationExpires: null,
    });

    return c.json(
      {
        message: "verified OTP. now you can create new password.",
      },
      200
    );
  } catch (error) {
    return c.json({ msg: "Internal server Error " });
  }
};
