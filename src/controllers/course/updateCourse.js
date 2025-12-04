import Course from "../../models/Course.js";
import path from "path";
import crypto from "crypto";
import { promises as fs } from "fs";
import { Op } from "sequelize";

export const updateCourse = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const body = await c.req.parseBody();
    const { courseTitle, description, courseOrder } = body;
    const thumbnail = body.thumbnail;

    if (
      !courseTitle ||
      !description ||
      courseOrder === undefined ||
      courseOrder === null
    ) {
      return c.json(
        { message: "courseTitle, description, and courseOrder are required" },
        400
      );
    }

    const course = await Course.findOne({ where: { publicId } });
    if (!course) return c.json({ error: "Course not found!" }, 404);

    // Check for duplicate title
    const existingTitle = await Course.findOne({
      where: {
        courseTitle,
        publicId: { [Op.ne]: publicId },
      },
    });
    if (existingTitle) {
      return c.json(
        { message: "Course title already exists, try another" },
        400
      );
    }

    let fileName = course.thumbnail; // keep existing if no new file
    if (thumbnail && thumbnail.name) {
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

      const ext = path.extname(thumbnail.name).replace(".", "").toLowerCase();
      const allowedExt = ["pdf", "jpg", "jpeg", "png"];
      if (!allowedExt.includes(ext)) {
        return c.json({ error: "Invalid file extension" }, 400);
      }

      fileName = `${crypto.randomUUID()}.${ext}`;
      const uploadDir = path.join(process.cwd(), "courses", "course_thumbnail");
      await fs.mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      await fs.writeFile(path.join(uploadDir, fileName), buffer);

      // delete old thumbnail
      if (course.thumbnail) {
        const oldPath = path.join(uploadDir, course.thumbnail);
        fs.unlink(oldPath).catch(() =>
          console.warn("Old thumbnail not found, skipping delete")
        );
      }
    }

    await course.update({
      courseTitle,
      description,
      courseOrder,
      thumbnail: fileName,
    });

    return c.json(
      {
        success: true,
        message: "Course updated successfully",
        data: {
          courseTitle: course.courseTitle,
          description: course.description,
          courseOrder: course.courseOrder,
          thumbnail: course.thumbnail,
        },
      },
      200
    );
  } catch (error) {
    console.error("Update course error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
