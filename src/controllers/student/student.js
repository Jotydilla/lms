import Student from "../../models/Student.js";
import User from "../../models/User.js";

const formatDate = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : null;

export const profile = async (c) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    if (user.userType !== "student")
      return c.json({ error: "Incorrect, you are not a student" });

    const userId = user.userId;

    const student = await Student.findOne({
      where: { user_id: userId },
      include: [{ model: User, attributes: ["phone"] }],
    });

    if (!student) {
      return c.json({ message: "You are not registered!" }, 404);
    }

    const row = student.toJSON();

    const flat = {
      studentId: row.publicId,
      fullName: [row.firstName, row.middleName, row.lastName]
        .filter(Boolean)
        .join(" "),
      phone: row.User?.phone || null,
      age: row.age,
      gender: row.gender,
      educationLevel: row.educationLevel,
      address: row.address,
      photo: row.photo,
      churchName: row.churchName,
      registerDate: formatDate(row.createdAt),
      updateDate: formatDate(row.updatedAt),
    };

    return c.json({ student: flat }, 200);
  } catch (error) {
    console.error("Profile error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
