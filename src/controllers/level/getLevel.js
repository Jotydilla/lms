import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const getLevel = async (c) => {
  try {
    const id = c.req.param("id");
    if (!id) return c.json({ message: "Level ID is required" }, 400);

    const level = await Level.findByPk(id, {
      attributes: [
        "level_id",
        "subject_id",
        "level_name",
        "payment_ammount",
        "week_number",
      ],
      include: [{ model: Subject, attributes: ["subject_name"] }],
    });

    if (!level) return c.json({ message: "Level not found!" }, 404);

    const row = level.toJSON();
    const flattened = {
      levelId: row.level_id,
      subjectName: row.Subject?.subject_name || null,
      levelName: row.level_name,
      paymentAmount: row.payment_ammount,
      weekNumber: row.week_number,
    };

    return c.json({ level: flattened });
  } catch (error) {
    console.error("Get level error:", error);
    return c.json({ message: "Internal server error!" }, 500);
  }
};
