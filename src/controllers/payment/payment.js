import StudentPayment from "../../models/StudentPayment.js";
import StudentClass from "../../models/StudentClass.js";
import PaymentMethod from "../../models/PaymentMethod.js";
import Student from "../../models/Student.js";
import User from "../../models/User.js";
import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const myPaymentInfo = async (c) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const userId = user.userId;

    const payments = await StudentPayment.findAll({
      include: [
        {
          model: StudentClass,
          include: [
            {
              model: Student,
              include: [{ model: User, where: { userId } }],
            },
            {
              model: Level,
              include: [{ model: Subject }],
            },
          ],
        },
        { model: PaymentMethod },
      ],
    });

    if (!payments || payments.length === 0) {
      return c.json({ message: "Payment data not found!" }, 404);
    }

    const formatDate = (date) =>
      date ? new Date(date).toISOString().slice(0, 10) : null;

    const flatten = payments.map((item) => {
      const row = item.toJSON();
      const levelPayment = row.StudentClass?.Level?.paymentAmmount || 0;
      const paidAmount = levelPayment * (row.payMonth || 0);

      const student = row.StudentClass?.Student;
      const studentName =
        student?.firstName || student?.middleName
          ? `${student?.firstName || ""} ${student?.middleName || ""}`.trim()
          : null;

      return {
        paymentId: row.publicId,
        classId: row.StudentClass?.publicId || null,
        studentName,
        subjectName: row.StudentClass?.Level?.Subject?.subjectName || null,
        levelName: row.StudentClass?.Level?.levelName || null,
        paymentMethod: row.PaymentMethod?.methodName || null,
        transactionNo: row.transactionNo,
        payMonth: row.payMonth || 0,
        levelPayment: `${levelPayment} ETB`,
        paidAmount: `${paidAmount} ETB`,
        paymentDate: formatDate(row.paymentDate),
        paymentStatus: row.paymentStatus,
        backToStudent: row.backToStudent,
        receipt: row.receipt,
        finishedCourse: row.finishedCourse,
        learningStatus: row.learningStatus,
        paidMonth: row.paidMonth || 0,
        registerDate: formatDate(row.createdAt),
        updateDate: formatDate(row.updatedAt),
      };
    });

    return c.json({ paymentInfo: flatten });
  } catch (error) {
    console.error("Error fetching my payment info:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
