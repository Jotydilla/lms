import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const addLevel = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (error) {
      console.error("Invalid JSON body:", error);
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const { subjectId, levelName, paymentAmount } = body;

    if (!subjectId) return c.json({ message: "Subject ID is required" }, 400);

    const checkSubject = await Subject.findByPk(subjectId);
    if (!checkSubject) return c.json({ message: "Subject not found!" }, 404);

    if (!levelName || levelName.trim().length === 0) {
      return c.json({ message: "Level name is required" }, 400);
    }

    const checkLevel = await Level.findOne({ where: { subjectId, levelName } });
    if (checkLevel) return c.json({ message: "Level already exists" }, 409);

    const newLevel = await Level.create({
      subjectId,
      levelName,
      paymentAmount,
    });

    return c.json(
      {
        message: "Level added successfully!",
        level: newLevel,
      },
      200
    );
  } catch (error) {
    console.error("Add level error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
