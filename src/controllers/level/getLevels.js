import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const getLevels = async (c) => {
  try {
    const levels = await Level.findAll({
      attributes: [
        "level_id",
        "subject_id",
        "level_name",
        "payment_ammount",
        "week_number",
      ],
      include: [{ model: Subject, attributes: ["subject_name"] }],
    });

    if (!levels || levels.length === 0) {
      return c.json({ message: "No levels found!" });
    }

    const flatten = levels.map((item) => {
      const row = item.toJSON();
      return {
        levelId: row.level_id,
        subjectName: row.Subject?.subject_name || null,
        levelName: row.level_name,
        paymentAmount: row.payment_ammount,
        weekNumber: row.week_number,
      };
    });

    return c.json({ levels: flatten }, 200);
  } catch (error) {
    console.error("Get levels error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
