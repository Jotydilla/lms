import StudentClass from "../../models/StudentClass.js";
import Student from "../../models/Student.js";
import Level from "../../models/Level.js";
import User from "../../models/User.js";
import Subject from "../../models/Subject.js";

export const getClass = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const studentClass = await StudentClass.findOne({
      where: { publicId },
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
    });

    if (!studentClass) {
      return c.json({ message: "Class data not found!" }, 404);
    }

    const row = studentClass.toJSON();
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

    const flat = {
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

    return c.json({ class: flat }, 200);
  } catch (error) {
    console.error("getClass error:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
