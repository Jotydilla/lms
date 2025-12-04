import geoip from "geoip-lite";

export const ipGeoMiddleware = (c, next) => {
  const ip = c.get("clientIP") || "127.0.0.1";
  const geo = geoip.lookup(ip);
  c.set("geo", geo || {});
  return next();
};
