import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import connection from "./config/database.js";
import routes from "./routes/index.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import { securityHeaders } from "./middleware/securityHeaders.js";

dotenv.config();
const app = new Hono();
app.use("*", cors());
// app.use("*", loggerMiddleware);
app.use("*", globalErrorHandler);
app.use("*", securityHeaders);
app.use("*", rateLimit({ windowMs: 60000, limit: 50 }));

const port = process.env.PORT;
app.get("/", (c) => {
  return c.json({ message: "API is running..." });
});
app.on("GET", ["/first", "/second"], (c) => c.text("hello from all"));
app.notFound((c) => {
  return c.json({ message: "this page not found!!" });
});

// Mounting all routes under /
app.route("/", routes);

try {
  await connection.authenticate();
  // console.log("Database connected successfully");
  await connection.sync({ alter: process.env.NODE_ENV === "development" });
  await connection.sync();
  // console.log("Models synced safely");
} catch (error) {
  console.error("Database not connected:", error);
}
serve({
  fetch: app.fetch,
  port: port,
  "0.0.0.0": true,
});
