import Subject from "../../models/Subject.js";

export const deleteSubject = async (c) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ message: "Invalid subject ID" }, 400);
    }

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return c.json({ message: "Subject not found" }, 404);
    }

    await subject.destroy();

    return c.json({
      success: true,
      message: "Deleted successfully",
      id: subject.subject_id,
    });
  } catch (error) {
    console.error("Delete subject error:", error.message);
    return c.json({ message: "Internal server error" }, 500);
  }
};
