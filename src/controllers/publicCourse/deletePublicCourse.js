import path from "path";
import { promises as fs } from "fs";
import PublicCourse from "../../models/PublicCourse.js";

export const deletePublicCourse = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const publicCourse = await PublicCourse.findOne({ where: { publicId } });
    if (!publicCourse) {
      return c.json({ message: "Course not found!" }, 404);
    }

    if (publicCourse.thumbnail) {
      const thumbPath = path.join(
        process.cwd(),
        "src/courses",
        "course_thumbnail",
        publicCourse.thumbnail
      );
      try {
        await fs.unlink(thumbPath);
      } catch (err) {
        console.warn("Thumbnail file not found, skipping delete.");
      }
    }
    await publicCourse.destroy();
    return c.json({ message: "Course deleted successfully!" }, 200);
  } catch (error) {
    console.error("delete course error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
