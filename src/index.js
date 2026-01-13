import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import connection from "./config/database.js";
import routes from "./routes/index.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { securityHeaders } from "./middleware/securityHeaders.js";

dotenv.config();
const app = new Hono();

app.use("*", cors());
app.use("*", securityHeaders);
// app.use("*", rateLimit({ windowMs: 60000, limit: 50 }));

app.route("/", routes);

app.get("/:folder/*", async (c) => {
  const folder = c.req.param("folder");
  const relativePath = c.req.path.replace(`/${folder}/`, "");
  const filePath = path.join(process.cwd(), "src", folder, relativePath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return c.json({ message: "page not found" }, 404);
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentTypeMap = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".txt": "text/plain",
    ".json": "application/json",
    ".pdf": "application/pdf",
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
  };
  const contentType = contentTypeMap[ext] || "application/octet-stream";
  const fileBuffer = fs.readFileSync(filePath);

  return new Response(fileBuffer, {
    status: 200,
    headers: { "Content-Type": contentType },
  });
});

app.get("/", (c) => c.json({ message: "API is running..." }));
app.on("GET", ["/first", "/second"], (c) => c.text("hello from all"));

app.onError((err, c) => {
  console.error(err);
  return c.json({ message: "Internal Server Error" }, 500);
});

app.notFound((c) => c.json({ message: "this page not found!!" }));

try {
  await connection.authenticate();
  console.log("Database connected successfully");
  await connection.sync({ alter: process.env.NODE_ENV === "development" });
} catch (error) {
  console.error("Database not connected:", error);
}

const port = process.env.PORT || 4000;
serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});
