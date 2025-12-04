import ExamQuestion from "../../models/ExamQuestion.js";

export const updateQuestion = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (error) {
      console.error("Invalid JSON body:", error);
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const id = c.req.params?.id;
    if (!id) return c.json({ error: "Question ID is required" });

    let {
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      marks,
    } = body;

    if (
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

    const question = await ExamQuestion.findByPk(id);
    if (!question) return c.json({ message: "Question not found" });

    const updatedQuestion = await question.update({
      questionText: questionText.trim(),
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      optionC: optionC.trim(),
      optionD: optionD.trim(),
      correctOption: correctOption.trim(),
      marks,
    });

    return c.json({
      message: "Question updated successfully!",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Update exam question error:", error);
    return c.json({ error: "Internal server error!" });
  }
};
