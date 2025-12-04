import Course from "../../models/Course.js";
import Exam from "../../models/Exam.js";

export const addExam = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (error) {
      console.error("Invalid JSON body:", error);
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    let { courseId, examTitle, timeLimit, totalMarks } = body;
    if (!courseId || !examTitle?.trim() || !timeLimit || !totalMarks) {
      return c.json({ message: "All fields are required" });
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return c.json({ message: "Course not found!" });
    }

    await Exam.create({
      courseId,
      examTitle: examTitle.trim(),
      timeLimit: Number(timeLimit),
      totalMarks: Number(totalMarks),
    });

    return c.json({ success: "Exam added successfully!" });
  } catch (error) {
    console.error("Add exam error:", error);
    return c.json({ error: "Internal server error!" });
  }
};
