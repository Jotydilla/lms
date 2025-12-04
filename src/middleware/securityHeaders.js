export const securityHeaders = async (c, next) => {
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  c.header("Referrer-Policy", "no-referrer");
  c.header("Permissions-Policy", "geolocation=(), camera=(), microphone=()");
  c.header("Cache-Control", "no-store");

  await next();
};
