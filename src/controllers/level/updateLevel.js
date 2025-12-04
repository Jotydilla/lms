import Level from "../../models/Level.js";

export const updateLevel = async (c) => {
  try {
    const id = c.req.params?.id;
    if (!id) return c.json({ message: "Level ID is required" }, 400);

    const body = await c.req.json();
    let { levelName, paymentAmount, weekNumber } = body;

    if (!levelName?.trim() || paymentAmount == null || weekNumber == null) {
      return c.json({ message: "All fields are required" }, 400);
    }

    paymentAmount = Number(paymentAmount);
    weekNumber = Number(weekNumber);
    if (
      isNaN(paymentAmount) ||
      paymentAmount < 0 ||
      isNaN(weekNumber) ||
      weekNumber <= 0
    ) {
      return c.json({ message: "Invalid payment amount or week number" }, 400);
    }

    const level = await Level.findByPk(id);
    if (!level) return c.json({ message: "Level not found!" }, 404);

    await level.update({
      levelName: levelName.trim(),
      paymentAmount,
      weekNumber,
    });

    return c.json({
      message: "Level updated successfully!",
      data: level,
    });
  } catch (error) {
    console.error("Update level error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
