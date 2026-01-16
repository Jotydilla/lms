import Student from "../../models/Student.js";

export const checkRegister = async (c) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    if (user.userType !== "student")
      return c.json({ error: "You have'nt a permission to register" }, 403);

    const existingStudent = await Student.findOne({
      where: { userId: user.userId },
    });
    if (existingStudent)
      return c.json({ error: "You are already registered" }, 400);

    return c.json({ message: "you can register now!" }, 200);
  } catch (error) {
    console.error("Error checking student:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
