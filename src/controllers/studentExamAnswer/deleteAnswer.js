import StudentExamAnswers from "../../models/StudentExamAnswers.js";

export const deleteAnswer = async (c) => {
  try {
    const id = c.req.param("id");

    const answer = await StudentExamAnswers.findByPk(id);
    if (!answer) {
      return c.json({ message: "Answer not found!!!" }, 404);
    }

    await answer.destroy();

    return c.json({ message: "Answer deleted successfully!", id: answer.id });
  } catch (error) {
    console.error("Deleting student answer error:", error.message);
    return c.json({ error: "Internal server error" }, 500);
  }
};
