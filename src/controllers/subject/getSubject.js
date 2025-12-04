import Subject from "../../models/Subject.js";

export const getSubject = async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ message: "Invalid subject ID" }, 400);
    }

    const subject = await Subject.findByPk(id);

    if (!subject) {
      return c.json({ message: "Subject not found!" }, 404);
    }

    const { subjectId, subjectName } = subject;
    const flat = {
      subjectId: subjectId,
      subjectName: subjectName,
    };

    return c.json({ subject: flat });
  } catch (error) {
    console.error("Get subject error:", error.message);
    return c.json({ message: "Internal server error" }, 500);
  }
};
