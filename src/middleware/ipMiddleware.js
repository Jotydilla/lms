import requestIp from "request-ip";

export const getClientIP = (c, next) => {
  const ip = requestIp.getClientIp(c.req);
  c.set("clientIP", ip || "unknown");
  return next();
};
