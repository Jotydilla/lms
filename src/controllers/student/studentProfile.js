import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import Student from "../../models/Student.js";

export const updatePhoto = async (c) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    if (user.userType !== "student")
      return c.json({ error: "You are not a student" }, 403);

    const userId = user.userId;
    const body = await c.req.parseBody();
    const photoFile = body.photo;

    if (!photoFile || !photoFile.name) {
      return c.json({ error: "Photo file is required" }, 400);
    }

    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return c.json({ msg: "You are not registered!" }, 404);
    }

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(photoFile.type)) {
      return c.json({ error: "Only JPG and PNG images are allowed" }, 400);
    }

    const ext = photoFile.type === "image/png" ? "png" : "jpg";
    const newFileName = `${crypto.randomUUID()}.${ext}`;

    const uploadDir = path.join(process.cwd(), "images", "profiles");
    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await photoFile.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, newFileName), buffer);

    if (student.photo) {
      const oldPath = path.join(uploadDir, student.photo);
      fs.unlink(oldPath).catch(() =>
        console.warn("Old photo not found, skipping delete")
      );
    }

    await student.update({ photo: newFileName });

    return c.json({ message: "Photo updated successfully!" });
  } catch (err) {
    console.error("Update error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
