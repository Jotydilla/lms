import Student from "../../models/Student.js";
import StudentClass from "../../models/StudentClass.js";
import { promises as fs } from "fs";
import path from "path";

export const deleteStudent = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const student = await Student.findOne({ where: { publicId } });

    if (!student) {
      return c.json({ message: "Student not found" }, 404);
    }

    const enrolledClass = await StudentClass.findOne({
      where: { studentId: student.studentId },
    });

    if (enrolledClass) {
      return c.json(
        {
          message:
            "Cannot delete this student because they are enrolled in a class",
        },
        400
      );
    }

    if (student.photo) {
      const photoPath = path.join(
        process.cwd(),
        "images",
        "profiles",
        student.photo
      );
      fs.unlink(photoPath).catch(() =>
        console.warn("Photo file not found, skipping delete")
      );
    }

    await student.destroy();
    return c.json({ message: "Deleted successfully!" }, 200);
  } catch (error) {
    console.error("deleteStudent error:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
