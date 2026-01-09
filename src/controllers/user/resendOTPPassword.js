import User from "../../models/User.js";
import VerificationSession from "../../models/VerificationSession.js";

const generateVerification = () => {
  const reCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  return { reCode, expires };
};

export const resendOTPPassword = async (c) => {
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

  if (!user) return c.json({ error: "User not found" }, 404);

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

  if (!verification.purpose === "password_reset")
    return c.json({ message: "Unauthorized" });

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
