import User from "../../models/User.js";
import VerificationSession from "../../models/VerificationSession.js";
import { Op } from "sequelize";

const generateVerification = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  return { code, expires };
};
export const verifyPhone = async (c) => {
  const { phone } = await c.req.json();
  const { code, expires } = generateVerification();

  const errors = [];
  if (!phone || !/^[0-9]{9,15}$/.test(phone))
    errors.push("Invalid phone number");

  if (errors.length > 0)
    return c.json({ error: "Validation failed", details: errors }, 400);

  const user = await User.findOne({ where: { phone } });
  if (!user) return c.json({ error: "Phone number not found" }, 404);

  if (user.is_verified)
    return c.json({ message: "your phone is verified, you can login" }, 403);

  const check_verification = await VerificationSession.findOne({
    where: {
      userId: user.userId,
      is_verified: false,
      purpose: "phone_verify",
      expiresAt: {
        [Op.gt]: new Date(),
      },
    },
    order: [["id", "DESC"]],
  });

  if (check_verification)
    return c.json(
      { message: "Please wait, a verification code has already been sent." },
      403,
    );

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const activityCount = await VerificationSession.count({
    where: {
      userId: user.userId,
      createdAt: {
        [Op.between]: [startOfDay, endOfDay],
      },
    },
  });

  if (activityCount >= 3) {
    return c.json(
      {
        message: "You have finished daily activity, try another day",
      },
      403,
    );
  }

  const verification = await VerificationSession.create({
    userId: user.userId,
    purpose: "phone_verify",
    otpHash: code,
    expiresAt: expires,
  });

  return c.json(
    { data: { message: " New OTP sent.", id: verification.verifyId } },
    200,
  );
};
