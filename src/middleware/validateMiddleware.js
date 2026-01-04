async function getBody(c) {
  const contentType = c.req.header("content-type") || "";
  if (contentType.includes("application/json")) {
    return await c.req.json();
  }
  if (
    contentType.includes("application/x-www-form-urlencoded") ||
    contentType.includes("multipart/form-data")
  ) {
    return await c.req.parseBody();
  }
  try {
    return await c.req.json();
  } catch {
    try {
      return await c.req.parseBody();
    } catch {
      return {};
    }
  }
}

export const validate = (rules = {}) => {
  return async (c, next) => {
    const body = await getBody(c).catch(() => ({}));
    const errors = [];

    for (const field in rules) {
      const rule = rules[field];

      if (rule.required && !body[field]) {
        errors.push(`${field} is required`);
        continue;
      }

      if (rule.type && body[field] && typeof body[field] !== rule.type) {
        errors.push(`${field} must be a ${rule.type}`);
      }

      if (rule.pattern && body[field] && !rule.pattern.test(body[field])) {
        errors.push(`${field} is invalid`);
      }

      if (rule.min && body[field] && body[field].length < rule.min) {
        errors.push(`${field} must be at least ${rule.min} characters`);
      }

      if (rule.max && body[field] && body[field].length > rule.max) {
        errors.push(`${field} must be at most ${rule.max} characters`);
      }
    }

    if (errors.length > 0) {
      return c.json(
        { error: "You have entered fields not accebtable", details: errors },
        400
      );
      // return c.json({ error: "Validation failed", details: errors }, 400);
    }

    await next();
  };
};
