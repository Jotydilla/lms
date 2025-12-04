import ExamQuestion from "../../models/ExamQuestion.js";
import Exam from "../../models/Exam.js";

export const addQuestion = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (error) {
      console.error("Invalid JSON body:", error);
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    let {
      examId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      marks,
    } = body;

    if (
      !examId ||
      !questionText?.trim() ||
      !optionA?.trim() ||
      !optionB?.trim() ||
      !optionC?.trim() ||
      !optionD?.trim() ||
      !correctOption?.trim() ||
      !marks
    ) {
      return c.json({ message: "All fields are required!" });
    }

    marks = Number(marks);
    if (isNaN(marks) || marks <= 0)
      return c.json({ message: "Marks must be a positive number" });

    const exam = await Exam.findByPk(examId);
    if (!exam) return c.json({ message: "Exam not found" });

    const newQuestion = await ExamQuestion.create({
      examId,
      questionText: questionText.trim(),
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      optionC: optionC.trim(),
      optionD: optionD.trim(),
      correctOption: correctOption.trim(),
      marks,
    });

    return c.json({
      message: "Question added successfully!",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Add exam question error:", error);
    return c.json({ error: "Internal server error!" });
  }
};
