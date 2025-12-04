import StudentPayment from "../../models/StudentPayment.js";
import StudentClass from "../../models/StudentClass.js";
import PaymentMethod from "../../models/PaymentMethod.js";
import Student from "../../models/Student.js";
import User from "../../models/User.js";
import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const backedPayment = async (c) => {
  try {
    const studentPayment = await StudentPayment.findAll({
      where: { backToStudent: true },
      include: [
        {
          model: StudentClass,
          as: "StudentClass",
          include: [
            { model: Student, include: [{ model: User }] },
            { model: Level, include: [{ model: Subject }] },
          ],
        },
        { model: PaymentMethod },
      ],
    });
    if (!studentPayment || studentPayment.length === 0) {
      return c.json({ message: "Payment not found!!" });
    }
    const flatten = studentPayment.map((item) => {
      const row = item.toJSON();
      const ammount = row.StudentClass?.Level?.paymentAmmount * row.payMonth;

      const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
      return {
        paymentId: row.publicId,
        classId: row.StudentClass?.publicId,
        studentName:
          row.StudentClass?.Student?.firstName +
            " " +
            row.StudentClass?.Student?.middleName || null,
        subjectName: row.StudentClass?.Level?.Subject?.subjectName || null,
        levelName: row.StudentClass?.Level?.levelName || null,

        paymentMethod: row.PaymentMethod?.methodName || null,
        transactionNo: row.transactionNo,
        payMonth: row.payMonth,
        levelPayment: row.StudentClass?.Level?.paymentAmmount,
        paidAmmount: ammount,
        paymentDate: formatDate(row.paymentDate),
        paymentStatus: row.paymentStatus,
        backToStudent: row.backToStudent,
        receipt: row.receipt,
        finishedCourse: row.finishedCourse,
        learningStatus: row.learningStatus,
        paidMonth: row.paidMonth,
        registerDate: formatDate(row.createdAt),
        // updateDate: format(row.updatedAt),
      };
    });
    return c.json({ payments: flatten });
  } catch (error) {
    return c.json({ message: "Internal server error" });
  }
};
