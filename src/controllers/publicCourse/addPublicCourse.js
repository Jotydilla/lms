import PublicCourse from "../../models/PublicCourse.js";
import path from "path";
import crypto from "crypto";
import { promises as fs } from "fs";

export const addPublicCourse = async (c) => {
  try {
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

    const existingPublicCourse = await PublicCourse.findOne({
      where: { courseTitle },
    });
    if (existingPublicCourse)
      return c.json({ message: "course already exist" }, 409);

    const allowedMime = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMime.includes(thumbnail.type)) {
      return c.json({ error: "Only JPG, JPEG, PNG files are allowed" }, 400);
    }

    const ext = path.extname(thumbnail.name).replace(".", "").toLowerCase();
    const allowedExt = ["jpg", "jpeg", "png"];
    if (!allowedExt.includes(ext)) {
      return c.json({ error: "Invalid file extension" }, 400);
    }

    const fileName = `${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(
      process.cwd(),
      "src/courses",
      "course_thumbnail"
    );
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await thumbnail.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, fileName), buffer);

    const newPublicCourse = await PublicCourse.create({
      courseTitle,
      description,
      instructorName,
      creditHr,
      thumbnail: fileName,
    });

    return c.json(
      {
        message: "Course added successfully!",
        data: {
          id: newPublicCourse.publicId,
          courseTitle: newPublicCourse.courseTitle,
          description: newPublicCourse.description,
          instructorName: newPublicCourse.instructorName,
          creditHr: newPublicCourse.creditHr,
          thumbnail: newPublicCourse.thumbnail,
        },
      },
      200
    );
  } catch (error) {
    console.error("Add public course error: ", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
