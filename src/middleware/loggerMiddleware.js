export const loggerMiddleware = async (c, next) => {
  const start = Date.now();

  const ip =
    c.req.header("X-Forwarded-For") ||
    c.req.raw?.connInfo?.remoteAddr ||
    "unknown";

  const method = c.req.method;
  const url = c.req.url;
  const user = c.get("user")?.publicId || "Guest";

  console.log(`[Request] ${method} ${url} | User: ${user} | IP: ${ip}`);

  await next();
  const ms = Date.now() - start;
  const status = c.res.status || 200;

  console.log(
    `[Response] ${method} ${url} | Status: ${status} | Time: ${ms}ms`
  );
};
