import Student from "../../models/Student.js";

export const studentCount = async (c) => {
  try {
    const count = await Student.count();
    if (!count) {
      return c.json({ message: "student not found!" });
    }
    return c.json({ total_student: count });
  } catch (error) {
    return c.json({ error: "Internal server error" });
  }
};
