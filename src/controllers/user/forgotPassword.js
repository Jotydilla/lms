import User from "../../models/User.js";
import VerificationSession from "../../models/VerificationSession.js";
import { Op } from "sequelize";

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
  if (!user) return c.json({ error: "Phone number not found" }, 404);

  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  if (user.lastChangePassword) {
    const lastChangeMs = new Date(user.lastChangePassword).getTime();
    const sinceLastChange = Date.now() - lastChangeMs;
    if (sinceLastChange < THREE_DAYS_MS) {
      const remainingMs = THREE_DAYS_MS - sinceLastChange;
      const remainingDays = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
      const remainingHours = Math.ceil(
        (remainingMs % (24 * 60 * 60 * 1000)) / (1000 * 60 * 60)
      );
      const dayLabel = remainingDays === 1 ? "day" : "days";
      const hourLabel = remainingHours === 1 ? "hour" : "hours";
      const timeMsg =
        remainingDays > 0
          ? `${remainingDays} ${dayLabel}${
              remainingHours > 0 ? ` and ${remainingHours} ${hourLabel}` : ""
            }`
          : `${remainingHours} ${hourLabel}`;

      return c.json(
        {
          // error: "Password recently changed",
          message: `You can change your password once every 3 days. Try again in ~ ${timeMsg}.`,
        },
        403
      );
    }
  }

  if (!user.is_verified)
    return c.json({ warning: "you phone not verified" }, 403);

  const check_verification = await VerificationSession.findOne({
    where: {
      userId: user.userId,
      expiresAt: {
        [Op.gt]: new Date(),
      },
    },
    order: [["id", "DESC"]],
  });

  if (check_verification)
    return c.json(
      { message: "Please wait, a verification code has already been sent." },
      403
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
      403
    );
  }

  const verification = await VerificationSession.create({
    userId: user.userId,
    purpose: "password_reset",
    otpHash: code,
    expiresAt: expires,
  });

  return c.json(
    { data: { message: " New OTP sent.", id: verification.verifyId } },
    200
  );
};
