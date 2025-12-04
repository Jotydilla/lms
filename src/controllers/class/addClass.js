import path from "path";
import crypto from "crypto";
import { Op } from "sequelize";
import Student from "../../models/Student.js";
import Level from "../../models/Level.js";
import StudentClass from "../../models/StudentClass.js";
import { promises as fs } from "fs";

export const addClass = async (c) => {
  try {
    const body = await c.req.parseBody();

    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const userId = user.userId;

    if (user.userType !== "student") return c.json("you are not student!!");

    const student = await Student.findOne({ where: { userId } });
    if (!student) return c.json({ error: "You are not registered!" }, 404);
    const studentId = student.studentId;

    const { levelId } = body;
    const criteriaFile = body.criteriaFile;

    if (!levelId || !criteriaFile) {
      return c.json({ message: "All fields are required" }, 400);
    }

    const level = await Level.findByPk(levelId);
    if (!level) {
      return c.json({ warning: "Level not found" }, 404);
    }

    // Check if already registered for this level
    const existingClass = await StudentClass.findOne({
      where: { studentId, levelId },
    });
    if (existingClass) {
      return c.json({ warning: "Already registered in this class" }, 409);
    }

    // Check if student has any unfinished class
    const unfinishedClass = await StudentClass.findOne({
      where: {
        studentId,
        learningStatus: { [Op.ne]: "finished" },
      },
    });
    if (unfinishedClass) {
      return c.json(
        {
          msg: "Finish your current course before enrolling in a new class",
        },
        400
      );
    }

    // File validation
    const allowedMime = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedMime.includes(criteriaFile.type)) {
      return c.json(
        { error: "Only PDF, JPG, JPEG, PNG files are allowed" },
        400
      );
    }

    const ext = criteriaFile.name.split(".").pop().toLowerCase();
    const allowedExt = ["pdf", "jpg", "jpeg", "png"];
    if (!allowedExt.includes(ext)) {
      return c.json({ error: "Invalid file extension" }, 400);
    }

    // Save file
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "files", "criteria");
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await criteriaFile.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, fileName), buffer);

    await StudentClass.create({
      studentId,
      levelId,
      criteriaFile: fileName,
    });

    return c.json({ message: "Registered successfully!" }, 201);
  } catch (error) {
    console.error("Error adding class:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
