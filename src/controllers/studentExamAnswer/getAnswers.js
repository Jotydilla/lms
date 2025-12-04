import StudentExamAnswers from "../../models/StudentExamAnswers.js";

export const getAnswers = async (c) => {
  try {
    const answers = await StudentExamAnswers.findAll();

    if (answers.length === 0) {
      return c.json({ message: "No answers found!!!" }, 404);
    }

    // Return full answer objects
    const formattedAnswers = answers.map((answer) => ({
      id: answer.id,
      classId: answer.classId,
      examId: answer.examId,
      questionId: answer.questionId,
      studentAnswer: answer.studentAnswer,
    }));

    return c.json({ answers: formattedAnswers });
  } catch (error) {
    console.error("Get student answers error:", error.message);
    return c.json({ error: "Internal server error" }, 500);
  }
};
