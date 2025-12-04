import ExamQuestion from "../../models/ExamQuestion.js";

export const deleteQuestion = async (c) => {
  try {
    const id = c.req.params?.id;
    if (!id) return c.json({ error: "Question ID is required" });

    const question = await ExamQuestion.findByPk(id);
    if (!question) return c.json({ message: "Question not found!" });

    await question.destroy();

    return c.json({ message: "Question deleted successfully!" });
  } catch (error) {
    console.error("Delete question error:", error);
    return c.json({ error: "Internal server error" });
  }
};
