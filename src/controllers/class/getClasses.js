import StudentClass from "../../models/StudentClass.js";
import Student from "../../models/Student.js";
import Level from "../../models/Level.js";
import User from "../../models/User.js";
import Subject from "../../models/Subject.js";

export const getClasses = async (c) => {
  try {
    const classes = await StudentClass.findAll({
      include: [
        { model: Student, include: [{ model: User }] },
        { model: Level, include: [{ model: Subject }] },
      ],
    });

    if (!classes || classes.length === 0) {
      return c.json({ message: "No classes found!" }, 404);
    }

    const flatten = classes.map((item) => {
      const row = item.toJSON();
      const formatDate = (date) =>
        date ? new Date(date).toISOString().slice(0, 10) : null;

      let paymentStatus;
      switch (row.paymentStatus) {
        case 0:
          paymentStatus = "not paid";
          break;
        case 1:
          paymentStatus = "paid";
          break;
        default:
          paymentStatus = "unknown";
      }

      return {
        classId: row.publicId,
        fullName: row.Student
          ? `${row.Student.firstName} ${row.Student.middleName || ""}`.trim()
          : null,
        phone: row.Student?.User?.phone || null,
        loginStatus: row.Student?.User?.status || null,
        address: row.Student?.address || null,
        subjectName: row.Level?.Subject?.subjectName || null,
        levelName: row.Level?.levelName || null,
        paymentAmount:
          row.Level?.paymentAmmount != null
            ? `${row.Level.paymentAmmount} ETB`
            : null,
        weekNumber: row.Level?.weekNumber || null,
        paymentStatus,

        finishedCourse: row.finishedCourse,
        learningStatus: row.learningStatus || null,
        joinDate: formatDate(row.joinDate),
        lastPaymentDate: formatDate(row.lastPaymentDate),
        paidMonth: row.paidMonth,
        registerDate: formatDate(row.createdAt),
        updateDate: formatDate(row.updatedAt),
      };
    });

    return c.json({ classes: flatten }, 200);
  } catch (error) {
    console.error("getClasses error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
