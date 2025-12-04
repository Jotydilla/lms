import Subject from "../../models/Subject.js";

export const addSubject = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const { subjectName } = body;
    const trimmedName = subjectName?.trim();

    if (!trimmedName) {
      return c.json({ message: "Subject name required" }, 400);
    }

    const checkSubject = await Subject.findOne({
      where: { subjectName: trimmedName },
    });
    if (checkSubject) {
      return c.json({ message: "Subject name already exists" }, 409);
    }

    const newSub = await Subject.create({ subjectName: trimmedName });

    return c.json(
      {
        success: true,
        message: "Added new subject successfully!",
        data: {
          id: newSub.subject_id,
          name: newSub.subjectName,
        },
      },
      201
    );
  } catch (error) {
    console.error("Add subject error:", error.message);
    return c.json({ message: "Internal server error" }, 500);
  }
};
