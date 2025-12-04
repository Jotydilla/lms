export const roleMiddleware = (allowedRoles = []) => {
  return async (c, next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const userRole = String(user.userType).toLowerCase();
    const roles = allowedRoles.map((r) => r.toLowerCase());

    if (!roles.includes(userRole)) {
      return c.json({ error: "Forbidden: Access denied" }, 403);
    }
    await next();
  };
};
