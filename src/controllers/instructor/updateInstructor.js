import Instructor from "../../models/Instructor.js";
import path from "path";
import crypto from "crypto";
import { promises as fs } from "fs";

export const updateInstructor = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const body = await c.req.parseBody();
    const { instructorName, instructorInfo } = body;
    const instructorProfile = body.instructorProfile;

    if (!instructorName || !instructorInfo) {
      return c.json({ message: "Instructor name and info are required" }, 400);
    }

    const instructor = await Instructor.findOne({
      where: { publicId },
    });

    if (!instructor) {
      return c.json({ message: "Instructor not found!" }, 404);
    }

    let fileName = instructor.instructorProfile;

    if (instructorProfile && instructorProfile.name) {
      const allowedMime = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedMime.includes(instructorProfile.type)) {
        return c.json({ error: "Only JPG, JPEG, PNG images are allowed" }, 400);
      }

      const ext = path.extname(instructorProfile.name).slice(1).toLowerCase();
      const allowedExt = ["jpg", "jpeg", "png"];

      if (!allowedExt.includes(ext)) {
        return c.json({ error: "Invalid file extension" }, 400);
      }

      fileName = `${crypto.randomUUID()}.${ext}`;
      const uploadDir = path.join(
        process.cwd(),
        "src/files",
        "instructor_profile"
      );

      await fs.mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await instructorProfile.arrayBuffer());
      await fs.writeFile(path.join(uploadDir, fileName), buffer);

      if (instructor.instructorProfile) {
        const oldPath = path.join(uploadDir, instructor.instructorProfile);
        fs.unlink(oldPath).catch(() =>
          console.warn("Old instructor profile not found, skipping delete")
        );
      }
    }

    await Instructor.update(
      {
        instructorName,
        instructorInfo,
        instructorProfile: fileName,
      },
      {
        where: { publicId },
      }
    );

    const updatedInstructor = await Instructor.findOne({
      where: { publicId },
    });

    return c.json(
      {
        success: true,
        message: "Instructor updated successfully!",
        data: {
          id: updatedInstructor.publicId,
          instructorName: updatedInstructor.instructorName,
          instructorInfo: updatedInstructor.instructorInfo,
          instructorProfile: updatedInstructor.instructorProfile,
        },
      },
      200
    );
  } catch (error) {
    console.error("Update Instructor Error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
