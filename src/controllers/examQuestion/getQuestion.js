import ExamQuestion from "../../models/ExamQuestion.js";
import Exam from "../../models/Exam.js";

export const getQuestion = async (c) => {
  try {
    const id = c.req.params?.id;
    if (!id) return c.json({ error: "Question ID is required" });

    const question = await ExamQuestion.findByPk(id, {
      include: [{ model: Exam }],
    });

    if (!question) return c.json({ message: "Question not found!" });

    return c.json({ question: question.toJSON() });
  } catch (error) {
    console.error("Get question error:", error);
    return c.json({ message: "Internal server error!" });
  }
};
