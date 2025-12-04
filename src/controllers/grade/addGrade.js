import Grades from "../../models/Grades.js";
import StudentClass from "../../models/StudentClass.js";
import Exam from "../../models/Exam.js";

export const addGrade = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (error) {
      return c.json({ error: "Invalid JSON format" });
    }
    const { classId, examId, totalMarksObtained, grade } = body;
    if (!classId || !examId || !totalMarksObtained || !grade)
      return c.json({ message: "All field must be required!" });
    const studentclass = await StudentClass.findByPk(classId);
    if (!studentclass || studentclass.length === 0) {
      return c.json({ message: "class not found" });
    }
    const exam = await Exam.findByPk(examId);
    if (!exam || exam.length === 0) {
      return c.json({ message: "exam not found" });
    }
    //
    //
    //
    //
  } catch (error) {
    console.log("Add grade error");
    return c.json({ error: "Internal server error!" });
  }
};
