import Instructor from "../../models/Instructor.js";
import path from "path";
import crypto from "crypto";
import { promises as fs } from "fs";

export const addInstructor = async (c) => {
  try {
    const body = await c.req.parseBody();
    const { instructorName, instructorInfo } = body;
    const instructorProfile = body.instructorProfile;

    if (!instructorName || !instructorInfo || !instructorProfile) {
      return c.json({ message: "All field are required" }, 400);
    }

    const existingInstructor = await Instructor.findOne({
      where: { instructorName },
    });
    if (existingInstructor) {
      return c.json({
        message: "Instructor already exists!!",
      });
    }

    const allowedMime = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedMime.includes(instructorProfile.type)) {
      return c.json(
        { error: "Only PDF, JPG, JPEG, PNG files are allowed" },
        400
      );
    }
    const ext = path
      .extname(instructorProfile.name)
      .replace(".", "")
      .toLowerCase();
    const allowedExt = ["pdf", "jpg", "jpeg", "png"];
    if (!allowedExt.includes(ext)) {
      return c.json({ error: "Invalid file extension" }, 400);
    }

    const fileName = `${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(
      process.cwd(),
      "src/files",
      "instructor_profile"
    );
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await instructorProfile.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, fileName), buffer);

    const newInstructor = await Instructor.create({
      instructorName,
      instructorInfo,
      instructorProfile: fileName,
    });

    return c.json(
      {
        message: "Instructor added successfully!",
        data: {
          id: newInstructor.publicId,
          instructorName: newInstructor.instructorName,
          instructorInfo: newInstructor.instructorInfo,
          instructorProfile: newInstructor.instructorProfile,
        },
      },
      200
    );
  } catch (error) {
    console.error("Add Instructor Error: ", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
