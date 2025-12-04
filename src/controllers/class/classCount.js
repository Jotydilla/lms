import StudentClass from "../../models/StudentClass.js";

export const classCount = async (c) => {
  try {
    const count = await StudentClass.count();
    return c.json({ totalClasses: count }, 200);
  } catch (error) {
    console.error("classCount error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
