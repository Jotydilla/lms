import Exam from "../../models/Exam.js";

export const updateExam = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (error) {
      console.error("Invalid JSON body:", error);
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const id = c.req.param("id");
    if (!id) return c.json({ error: "Exam ID is required" });

    const { examTitle, timeLimit, totalMarks } = body;
    if (!examTitle?.trim() || !timeLimit || !totalMarks) {
      return c.json({ message: "All fields are required" });
    }

    const exam = await Exam.findByPk(id);
    if (!exam) return c.json({ message: "Exam not found!" });

    await exam.update({
      examTitle: examTitle.trim(),
      timeLimit: Number(timeLimit),
      totalMarks: Number(totalMarks),
    });

    return c.json({
      success: "Exam updated successfully!",
      exam: {
        examId: exam.examId,
        examTitle: exam.examTitle,
        timeLimit: exam.timeLimit,
        totalMarks: exam.totalMarks,
      },
    });
  } catch (error) {
    console.error("Update exam error:", error);
    return c.json({ error: "Internal server error!" });
  }
};
