import StudentClass from "../../models/StudentClass.js";
import StudentPayment from "../../models/StudentPayment.js";

export const completePayment = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const payment = await StudentPayment.findOne({ where: { publicId } });
    if (!payment) {
      return c.json({ error: "Payment not found" }, 404);
    }

    // Mark the payment as completed
    await payment.update({ paymentStatus: true });

    const studentClass = await StudentClass.findByPk(payment.classId);
    if (!studentClass) {
      return c.json({ error: "Class not found" }, 404);
    }

    // Calculate joinDate and lastPaymentDate
    let joinDate = studentClass.joinDate;
    let lastPaymentDate = new Date(studentClass.lastPaymentDate);

    if (!joinDate || joinDate.getTime() === lastPaymentDate.getTime()) {
      joinDate = new Date();
      lastPaymentDate = new Date();
    }

    lastPaymentDate.setMonth(lastPaymentDate.getMonth() + payment.payMonth);

    // Update learning status if it's still "new"
    const learningStatus =
      studentClass.learningStatus === "new"
        ? "current"
        : studentClass.learningStatus;

    const paidMonth = studentClass.paidMonth + payment.payMonth;

    await studentClass.update({
      joinDate,
      lastPaymentDate,
      paidMonth,
      paymentStatus: false,
      learningStatus,
    });

    return c.json(
      {
        message: "Payment completed successfully!",
        data: {
          paymentId: payment.publicId,
          lastPaymentDate,
          paidMonth,
          paymentStatus: studentClass.paymentStatus,
        },
      },
      200
    );
  } catch (error) {
    console.error("Error completing payment:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
