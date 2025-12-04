import Student from "../../models/Student.js";
import User from "../../models/User.js";

const formatDate = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : null;

export const getStudents = async (c) => {
  try {
    const students = await Student.findAll({
      include: [{ model: User, attributes: ["phone", "status"] }],
    });

    if (!students || students.length === 0) {
      return c.json({ message: "No students found" }, 404);
    }

    const flatten = students.map((item) => {
      const row = item.toJSON();
      return {
        studentId: row.publicId,
        fullName: [row.firstName, row.middleName, row.lastName]
          .filter(Boolean)
          .join(" "),
        phone: row.User?.phone || null,
        status: row.User?.status || null,
        age: row.age,
        gender: row.gender,
        educationLevel: row.educationLevel,
        address: row.address,
        photo: row.photo,
        churchName: row.churchName,
        registerDate: formatDate(row.createdAt),
        updateDate: formatDate(row.updatedAt),
      };
    });

    return c.json({ students: flatten }, 200);
  } catch (error) {
    console.error("getStudents error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
