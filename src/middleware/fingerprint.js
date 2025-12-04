import crypto from "crypto";

export const fingerprintMiddleware = async (c, next) => {
  const ip =
    c.req.header("X-Forwarded-For") ||
    c.req.raw.connInfo?.remoteAddr ||
    "unknown";

  const userAgent = c.req.header("User-Agent") || "unknown-device";

  // Hash device fingerprint
  const fingerprint = crypto
    .createHash("sha256")
    .update(ip + userAgent)
    .digest("hex");

  // store fingerprint in request context
  c.set("fingerprint", fingerprint);

  await next();
};
