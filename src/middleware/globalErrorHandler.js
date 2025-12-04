export const globalErrorHandler = async (c, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Global Error:", err);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    return c.json({ error: message }, status);
  }
};
