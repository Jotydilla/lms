import Instructor from "../../models/Instructor.js";
import path from "path";
import { promises as fs } from "fs";

export const deleteInstructor = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const instructor = await Instructor.findOne({ where: { publicId } });
    if (!instructor) {
      return c.json({ message: "Instructor not found!" }, 404);
    }

    if (instructor.instructorProfile) {
      const profPath = path.join(
        process.cwd(),
        "src/files",
        "instructor_profile",
        instructor.instructorProfile
      );
      try {
        await fs.unlink(profPath);
      } catch (err) {
        console.warn("Profile file not found, skipping delete.");
      }
    }

    await instructor.destroy();

    return c.json({ message: "Instructor deleted successfully!" }, 200);
  } catch (error) {
    console.error("delete Instructor error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
