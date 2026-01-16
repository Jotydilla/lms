import path from "path";
import crypto from "crypto";
import Level from "../../models/Level.js";
import StudentClass from "../../models/StudentClass.js";
import { promises as fs } from "fs";
import Student from "../../models/Student.js";

export const updateClass = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const body = await c.req.parseBody();
    const { levelId } = body;
    const criteriaFile = body.criteriaFile;

    if (!levelId) {
      return c.json({ message: "levelId is required" }, 400);
    }

    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const student = await Student.findOne({ where: { userId: user.userId } });
    if (!student) return c.json({ error: "You are not registered" }, 403);

    const myClass = await StudentClass.findOne({
      where: { publicId, studentId: student.studentId },
      include: [Level],
    });
    if (!myClass) return c.json({ error: "Class not found" }, 404);

    const level = await Level.findByPk(levelId);
    if (!level) return c.json({ error: "Level not found" }, 404);

    const updateData = { levelId };

    if (criteriaFile && criteriaFile.name) {
      const allowedMime = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      const allowedExt = ["pdf", "jpg", "jpeg", "png"];

      if (!allowedMime.includes(criteriaFile.type)) {
        return c.json({ error: "Only PDF, JPG, JPEG, PNG files allowed" }, 400);
      }

      const ext = criteriaFile.name.toLowerCase().split(".").pop();
      if (!allowedExt.includes(ext)) {
        return c.json({ error: "Invalid file extension" }, 400);
      }

      const fileName = `${crypto.randomUUID()}.${ext}`;
      const uploadDir = path.join(process.cwd(), "scr/files", "criteria");
      await fs.mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await criteriaFile.arrayBuffer());
      await fs.writeFile(path.join(uploadDir, fileName), buffer);

      if (myClass.criteriaFile) {
        try {
          await fs.unlink(path.join(uploadDir, myClass.criteriaFile));
        } catch (e) {
          console.warn("Old criteria file not found, skipping delete");
        }
      }

      updateData.criteriaFile = fileName;
    }

    await myClass.update(updateData);
    await myClass.reload({ include: [Level] });

    return c.json(
      {
        success: true,
        message: "Class updated successfully!",
        data: {
          id: myClass.publicId,
          level: myClass.Level?.levelName || null,
        },
      },
      200
    );
  } catch (error) {
    console.error("Error updating class:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
