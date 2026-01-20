import crypto from "crypto";

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const generateFingerprint = (c) => {
  const userAgent = c.req.header("User-Agent") || "";
  const deviceId = c.req.header("X-Device-ID") || "";
  return crypto
    .createHash("sha256")
    .update(`${deviceId}|${userAgent}`)
    .digest("hex");
};
