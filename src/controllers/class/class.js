import StudentClass from "../../models/StudentClass.js";
import Student from "../../models/Student.js";
import Level from "../../models/Level.js";
import User from "../../models/User.js";
import Subject from "../../models/Subject.js";

export const myClass = async (c) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const userId = user.userId;

    const student = await Student.findOne({ where: { userId } });
    if (!student) return c.json({ error: "You are not registered!" }, 404);
    const studentId = student.studentId;

    const classes = await StudentClass.findAll({
      where: { studentId },
      include: [
        {
          model: Student,
          include: [{ model: User }],
        },
        {
          model: Level,
          include: [{ model: Subject }],
        },
      ],
      order: [["joinDate", "DESC"]],
    });

    if (!classes.length) {
      return c.json({ message: "No classes found!" }, 404);
    }

    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : null;

    const flatten = classes.map((item) => {
      const row = item.toJSON();
      const subjects = Array.isArray(row.Level?.Subjects)
        ? row.Level.Subjects.map((s) => s.subjectName)
        : [];

      const fullName = [
        row.Student?.firstName,
        row.Student?.middleName,
        row.Student?.lastName,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        classId: row.publicId,
        fullName: fullName || null,
        phone: row.Student?.User?.phone || null,
        loginStatus: row.Student?.User?.status || null,
        address: row.Student?.address || null,
        subject: row.Level?.Subject?.subjectName,
        levelName: row.Level?.levelName || null,
        paymentAmount:
          row.Level?.paymentAmount ?? row.Level?.paymentAmmount ?? null,
        weekNumber: row.Level?.weekNumber || null,

        paymentStatus: row.paymentStatus,
        finishedCourse: row.finishedCourse,
        learningStatus: row.learningStatus,
        joinDate: formatDate(row.joinDate),
        lastPaymentDate: formatDate(row.lastPaymentDate),
        paidMonth: row.paidMonth,
        registerDate: formatDate(row.createdAt),
        updateDate: formatDate(row.updatedAt),
      };
    });

    return c.json({ myClasses: flatten }, 200);
  } catch (error) {
    console.error("myClass error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
