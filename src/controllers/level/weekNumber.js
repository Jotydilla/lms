import Level from "../../models/Level.js";

export const weekNumber = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const id = c.req.param("id");
    let { weekNumber } = body;

    if (!weekNumber || weekNumber.length === o)
      return c.json({ message: "week number required" });

    const level = await Level.findByPk(id);

    if (!level || level.length === 0)
      return c.json({ message: "level not found!!" });

    await level.update({ weekNumber });

    return c.json({
      success: "update successfully!!",
      data: {
        levelId: level.levelId,
        levelName: level.levelName,
        weekNumber: level.weekNumber,
      },
    });
  } catch (error) {
    console.log("week number update error");
    return c.json({ error: "Internal server error" });
  }
};
