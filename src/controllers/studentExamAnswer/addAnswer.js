import ExamQuestion from "../../models/ExamQuestion.js";
import StudentClass from "../../models/StudentClass.js";
import Exam from "../../models/Exam.js";
import StudentExamAnswers from "../../models/StudentExamAnswers.js";

export const addAnswer = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const { classId, examId, questionId, studentAnswer } = body;

    if (!classId || !examId || !questionId || !studentAnswer) {
      return c.json({ message: "All fields are required!!!" }, 400);
    }

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return c.json({ message: "Exam not found!!!" }, 404);
    }

    const student = await StudentClass.findByPk(classId);
    if (!student) {
      return c.json({ message: "Student not found!!!" }, 404);
    }

    const question = await ExamQuestion.findByPk(questionId);
    if (!question) {
      return c.json({ message: "Question not found!!!" }, 404);
    }

    const newAnswer = await StudentExamAnswers.create({
      classId,
      examId,
      questionId,
      studentAnswer,
    });

    return c.json({
      success: "Answered new question successfully!!",
      answer: {
        id: newAnswer.id,
        classId: newAnswer.classId,
        examId: newAnswer.examId,
        questionId: newAnswer.questionId,
        studentAnswer: newAnswer.studentAnswer,
      },
    });
  } catch (error) {
    console.error("Add exam answer error:", error.message);
    return c.json({ error: "Internal Server Error!!!" }, 500);
  }
};
