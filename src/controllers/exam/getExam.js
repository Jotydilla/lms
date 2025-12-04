import Exam from "../../models/Exam.js";
import Course from "../../models/Course.js";
import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const getExam = async (c) => {
  try {
    const id = c.req.params?.id;
    if (!id) return c.json({ error: "Exam ID is required" });

    const exam = await Exam.findByPk(id, {
      include: [
        {
          model: Course,
          include: [
            {
              model: Level,
              include: [{ model: Subject }],
            },
          ],
        },
      ],
    });

    if (!exam) {
      return c.json({ message: "Exam not found!" });
    }

    const row = exam.toJSON();
    const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

    const flat = {
      examId: row.examId,
      courseId: row.courseId,
      courseTitle: row.Course?.courseTitle,
      levelName: row.Course?.Level?.levelName,
      subjectName: row.Course?.Level?.Subject?.subjectName,
      examTitle: row.examTitle,
      timeLimit: row.timeLimit,
      totalMarks: row.totalMarks,
      createdAt: formatDate(row.createdAt),
      updatedAt: formatDate(row.updatedAt),
    };

    return c.json({ exam: flat });
  } catch (error) {
    console.error("Get exam error:", error);
    return c.json({ error: "Internal server error" });
  }
};
