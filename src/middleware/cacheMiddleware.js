import Redis from "ioredis";

const redis = new Redis();
export const redisCacheMiddleware = (ttl = 60) => {
  return async (c, next) => {
    const key = c.req.url;

    const cachedData = await redis.get(key);
    if (cachedData) {
      console.log("[Redis Cache] Serving cached response for", key);
      return c.json(JSON.parse(cachedData));
    }
    await next();
    const body = c.res.body;
    if (body) {
      await redis.set(key, JSON.stringify(body), "EX", ttl);
    }
  };
};
