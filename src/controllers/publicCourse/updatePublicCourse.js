import PublicCourse from "../../models/PublicCourse.js";
import path from "path";
import crypto from "crypto";
import { promises as fs } from "fs";
import { Op } from "sequelize";

export const updatePublicCourse = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const body = await c.req.parseBody();
    const { courseTitle, description, instructorName, creditHr } = body;
    const thumbnail = body.thumbnail;
    if (
      !courseTitle ||
      !description ||
      !instructorName ||
      !creditHr ||
      !thumbnail
    )
      return c.json({ message: "All fields are required!!" });

    const publicCourse = await PublicCourse.findOne({ where: { publicId } });
    if (!publicCourse) return c.json({ error: "Course not found!" }, 404);

    const existingPublicCourse = await PublicCourse.findOne({
      where: {
        courseTitle,
        publicId: { [Op.ne]: publicId },
      },
    });
    if (existingPublicCourse)
      return c.json({ message: "course Title already exist" }, 409);

    let fileName = publicCourse.thumbnail;
    if (thumbnail && thumbnail.name) {
      const allowedMime = [
        // "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!allowedMime.includes(thumbnail.type)) {
        return c.json({ error: "Only JPG, JPEG, PNG files are allowed" }, 400);
      }

      const ext = path.extname(thumbnail.name).replace(".", "").toLowerCase();
      const allowedExt = ["jpg", "jpeg", "png"];
      if (!allowedExt.includes(ext)) {
        return c.json({ error: "Invalid file extension" }, 400);
      }

      fileName = `${crypto.randomUUID()}.${ext}`;
      const uploadDir = path.join(
        process.cwd(),
        "src/courses",
        "course_thumbnail"
      );
      await fs.mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await thumbnail.arrayBuffer());
      await fs.writeFile(path.join(uploadDir, fileName), buffer);

      if (publicCourse.thumbnail) {
        const oldPath = path.join(uploadDir, publicCourse.thumbnail);
        fs.unlink(oldPath).catch(() =>
          console.warn("Old thumbnail not found, skipping delete")
        );
      }
    }

    await publicCourse.update({
      courseTitle,
      description,
      instructorName,
      creditHr,
      thumbnail: fileName,
    });

    return c.json(
      {
        success: true,
        message: "Course updated successfully!",
        data: {
          id: publicCourse.publicId,
          courseTitle: publicCourse.courseTitle,
          description: publicCourse.description,
          instructorName: publicCourse.instructorName,
          creditHr: publicCourse.creditHr,
          thumbnail: publicCourse.thumbnail,
        },
      },
      200
    );
  } catch (error) {
    console.error("Add public course error: ", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
