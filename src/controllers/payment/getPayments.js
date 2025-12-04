import StudentPayment from "../../models/StudentPayment.js";
import StudentClass from "../../models/StudentClass.js";
import PaymentMethod from "../../models/PaymentMethod.js";
import Student from "../../models/Student.js";
import User from "../../models/User.js";
import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const getPayments = async (c) => {
  try {
    const payments = await StudentPayment.findAll({
      include: [
        {
          model: StudentClass,
          include: [
            { model: Student, include: [{ model: User }] },
            { model: Level, include: [{ model: Subject }] },
          ],
        },
        { model: PaymentMethod },
      ],
    });

    if (!payments || payments.length === 0) {
      return c.json({ message: "Payments not found!" }, 404);
    }

    const formatDate = (date) =>
      date ? new Date(date).toISOString().slice(0, 10) : null;

    const flatten = payments.map((payment) => {
      const row = payment.toJSON();
      const levelPayment = row.Class?.Level?.paymentAmmount || 0;
      const paidAmount = levelPayment * (row.payMonth || 0);

      const student = row.Class?.Student;
      const studentName =
        student?.firstName && student?.middleName
          ? `${student.firstName} ${student.middleName}`
          : null;

      return {
        paymentId: row.publicId,
        classId: row.Class?.publicId || null,
        studentName,
        subjectName: row.Class?.Level?.Subject?.subjectName || null,
        levelName: row.Class?.Level?.levelName || null,
        paymentMethod: row.PaymentMethod?.methodName || null,
        transactionNo: row.transactionNo,
        payMonth: row.payMonth,
        levelPayment,
        paidAmount,
        paymentDate: formatDate(row.paymentDate),
        paymentStatus: row.paymentStatus,
        backToStudent: row.backToStudent,
        receipt: row.receipt,
        finishedCourse: row.finishedCourse,
        learningStatus: row.learningStatus,
        paidMonth: row.paidMonth,
        registerDate: formatDate(row.createdAt),
        updateDate: formatDate(row.updatedAt),
      };
    });

    return c.json({ payments: flatten });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
