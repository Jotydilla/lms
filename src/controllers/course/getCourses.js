import Course from "../../models/Course.js";
import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const getCourses = async (c) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: Level,
          include: [{ model: Subject }],
        },
      ],
      order: [["courseOrder", "ASC"]],
    });

    if (!courses || courses.length === 0) {
      return c.json({ message: "No courses found" }, 404);
    }

    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : null;

    const flatten = courses.map((course) => {
      const row = course.toJSON();

      return {
        courseId: row.courseId,
        publicId: row.publicId,
        courseTitle: row.courseTitle,
        description: row.description,
        thumbnail: row.thumbnail,
        subjectName: row.Level?.Subject.subjectName,
        levelName: row.Level?.levelName ?? null,
        paymentAmount: Number(
          row.Level?.paymentAmount ?? row.Level?.paymentAmmount ?? 0
        ),
        weekNumber: Number(row.Level?.weekNumber ?? 0),
        courseOrder: Number(row.courseOrder),
        createdAt: formatDate(row.createdAt),
        updatedAt: formatDate(row.updatedAt),
      };
    });

    return c.json({ courses: flatten }, 200);
  } catch (error) {
    console.error("getCourses error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
