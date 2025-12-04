import Exam from "../../models/Exam.js";
import ExamQuestion from "../../models/ExamQuestion.js";

export const deleteExam = async (c) => {
  try {
    const id = c.req.params?.id;
    if (!id) return c.json({ error: "Exam ID is required" });

    const exam = await Exam.findByPk(id);
    if (!exam) return c.json({ message: "Exam not found" });

    const examQuestion = await ExamQuestion.findOne({
      where: { examId: exam.examId },
    });
    if (examQuestion) {
      return c.json({
        message: "Cannot delete exam: exam has associated questions",
      });
    }

    await exam.destroy();
    return c.json({ success: "Exam deleted successfully!" });
  } catch (error) {
    console.error("Delete exam error:", error);
    return c.json({ error: "Internal server error" });
  }
};
