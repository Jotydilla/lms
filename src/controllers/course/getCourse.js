import Course from "../../models/Course.js";
import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const getCourse = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const course = await Course.findOne({
      where: { publicId },
      include: [
        {
          model: Level,
          include: [{ model: Subject }],
        },
      ],
    });

    if (!course) {
      return c.json({ message: "Course not found!" }, 404);
    }

    const row = course.toJSON();

    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : null;

    const flat = {
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

    return c.json({ course: flat }, 200);
  } catch (error) {
    console.error("getCourse error:", error);
    return c.json({ error: "Internal server error!" }, 500);
  }
};
