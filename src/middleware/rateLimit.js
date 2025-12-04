const rateStore = new Map();

export const rateLimit = (options = {}) => {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute
  const limit = options.limit || 10; // default 10 requests per minute

  return async (c, next) => {
    const ip =
      (c.req.header("X-Forwarded-For") || c.req.raw.connInfo?.remoteAddr) ??
      "unknown";

    const now = Date.now();
    const entry = rateStore.get(ip) || { count: 0, last: now };

    // Reset window
    if (now - entry.last > windowMs) {
      entry.count = 0;
      entry.last = now;
    }
    entry.count += 1;
    rateStore.set(ip, entry);
    if (entry.count > limit) {
      return c.json({ error: "Too many requests. Try again later." }, 429);
    }
    await next();
  };
};
