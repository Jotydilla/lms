import ExamQuestion from "../../models/ExamQuestion.js";
import Exam from "../../models/Exam.js";

export const getQuestions = async (c) => {
  try {
    const questions = await ExamQuestion.findAll({
      include: [{ model: Exam }],
    });

    if (!questions || questions.length === 0) {
      return c.json({ message: "No questions found!" });
    }

    return c.json({ questions: questions.map((q) => q.toJSON()) });
  } catch (error) {
    console.error("Get questions error:", error);
    return c.json({ message: "Internal server error!" });
  }
};
