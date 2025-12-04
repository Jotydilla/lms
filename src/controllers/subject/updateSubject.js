import Subject from "../../models/Subject.js";

export const updateSubject = async (c) => {
  try {
    const body = await c.req.json();
    const { subjectName } = body;

    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ message: "Invalid subject ID" }, 400);
    }

    if (!subjectName || subjectName.trim().length === 0) {
      return c.json({ message: "Subject name is required" }, 400);
    }

    const trimmedName = subjectName.trim();

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return c.json({ message: "Subject not found" }, 404);
    }

    const existing = await Subject.findOne({
      where: { subjectName: trimmedName },
    });
    if (existing && existing.subject_id !== id) {
      return c.json({ message: "Subject name already exists" }, 409);
    }

    await subject.update({ subjectName: trimmedName });

    return c.json(
      {
        success: true,
        message: "Updated successfully!",
        data: { id: subject.subject_id, name: subject.subjectName },
      },
      200
    );
  } catch (error) {
    console.error("Update subject error:", error.message);
    return c.json({ message: "Internal server error" }, 500);
  }
};
