import Course from "../../models/Course.js";
import Level from "../../models/Level.js";
import path from "path";
import crypto from "crypto";
import { promises as fs } from "fs";

export const addCourse = async (c) => {
  try {
    const body = await c.req.parseBody();
    const { levelId, courseTitle, description, courseOrder } = body;
    const thumbnail = body.thumbnail;

    // Validate required fields
    if (
      !levelId ||
      !courseTitle ||
      !description ||
      courseOrder === undefined ||
      courseOrder === null ||
      !thumbnail
    ) {
      return c.json({ message: "All fields are required" }, 400);
    }

    // Validate level exists
    const level = await Level.findByPk(levelId);
    if (!level) return c.json({ message: "Level not found!" }, 404);

    // Check for duplicate course in this level
    const existingCourse = await Course.findOne({
      where: { levelId, courseTitle },
    });
    if (existingCourse) {
      return c.json(
        { message: "This course already exists for this level!" },
        409
      );
    }

    // Validate thumbnail type
    const allowedMime = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedMime.includes(thumbnail.type)) {
      return c.json(
        { error: "Only PDF, JPG, JPEG, PNG files are allowed" },
        400
      );
    }

    // Validate file extension
    const ext = path.extname(thumbnail.name).replace(".", "").toLowerCase();
    const allowedExt = ["pdf", "jpg", "jpeg", "png"];
    if (!allowedExt.includes(ext)) {
      return c.json({ error: "Invalid file extension" }, 400);
    }

    // Save file
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "courses", "course_thumbnail");
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await thumbnail.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, fileName), buffer);

    // Create course
    const newCourse = await Course.create({
      levelId,
      courseTitle,
      description,
      courseOrder,
      thumbnail: fileName,
    });

    // Return success
    return c.json(
      {
        message: "Course added successfully!",
        data: {
          id: newCourse.publicId || newCourse.id,
          levelId: newCourse.levelId,
          courseTitle: newCourse.courseTitle,
          description: newCourse.description,
          courseOrder: newCourse.courseOrder,
          thumbnail: newCourse.thumbnail,
        },
      },
      201
    );
  } catch (error) {
    console.error("Add course error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
