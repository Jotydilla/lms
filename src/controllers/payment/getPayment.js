import StudentPayment from "../../models/StudentPayment.js";
import StudentClass from "../../models/StudentClass.js";
import PaymentMethod from "../../models/PaymentMethod.js";
import Student from "../../models/Student.js";
import User from "../../models/User.js";
import Level from "../../models/Level.js";
import Subject from "../../models/Subject.js";

export const getPayment = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const payment = await StudentPayment.findOne({
      where: { public_id: publicId },
      include: [
        {
          model: StudentClass,
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
        },
        { model: PaymentMethod },
      ],
    });

    if (!payment) {
      return c.json({ message: "payment data not found!" }, 404);
    }
    const row = payment.toJSON();
    const ammount = row.StudentClass?.Level?.paymentAmmount * row.payMonth;
    const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
    const flat = {
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
      // updateDate: formatDate(row.updatedAt),
    };
    return c.json({ payment: flat });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
