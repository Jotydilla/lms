import StudentExamAnswers from "../../models/StudentExamAnswers.js";

export const getAnswer = async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ message: "Invalid answer ID" }, 400);
    }

    const answer = await StudentExamAnswers.findByPk(id);
    if (!answer) {
      return c.json({ message: "Answer not found!!!" }, 404);
    }

    return c.json({
      success: true,
      data: {
        id: answer.id,
        classId: answer.classId,
        examId: answer.examId,
        questionId: answer.questionId,
        studentAnswer: answer.studentAnswer,
      },
    });
  } catch (error) {
    console.error("Get student answer error:", error.message);
    return c.json({ error: "Internal server error" }, 500);
  }
};
