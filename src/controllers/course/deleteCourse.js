import Course from "../../models/Course.js";
import Exam from "../../models/Exam.js";
import path from "path";
import { promises as fs } from "fs";

export const deleteCourse = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const course = await Course.findOne({ where: { publicId } });
    if (!course) {
      return c.json({ message: "Course not found!" }, 404);
    }

    // Check related exams
    const exam = await Exam.findOne({ where: { courseId: course.courseId } });
    if (exam) {
      return c.json(
        {
          message:
            "Cannot delete this course because it has related exam records.",
        },
        400
      );
    }

    // Delete thumbnail if exists
    if (course.thumbnail) {
      const thumbPath = path.join(
        process.cwd(),
        "courses",
        "course_thumbnail",
        course.thumbnail
      );
      try {
        await fs.unlink(thumbPath);
      } catch (err) {
        console.warn("Thumbnail file not found, skipping delete.");
      }
    }

    await course.destroy();

    return c.json({ message: "Course deleted successfully!" }, 200);
  } catch (error) {
    console.error("delete course error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
