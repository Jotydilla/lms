import Student from "../../models/Student.js";
import User from "../../models/User.js";

const formatDate = (date) =>
  date ? new Date(date).toISOString().slice(0, 10) : null;

export const getStudent = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const student = await Student.findOne({
      where: { publicId },
      include: [{ model: User, attributes: ["phone", "status"] }],
    });

    if (!student) {
      return c.json({ message: "Student not found" }, 404);
    }

    const row = student.toJSON();

    const flat = {
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

    return c.json({ student: flat }, 200);
  } catch (error) {
    console.error("getStudent error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
