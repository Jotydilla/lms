import Exam from "../../models/Exam.js";
import Course from "../../models/Course.js";
import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const getExams = async (c) => {
  try {
    const exams = await Exam.findAll({
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

    if (!exams || exams.length === 0) {
      return c.json({ message: "No exams found!" });
    }

    const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

    const flatten = exams.map((item) => {
      const row = item.toJSON();
      return {
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
    });

    return c.json({ exams: flatten });
  } catch (error) {
    console.error("Get exams error:", error);
    return c.json({ error: "Internal server error" });
  }
};
