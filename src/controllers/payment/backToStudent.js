import StudentPayment from "../../models/StudentPayment.js";

export const backToStudent = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const payment = await StudentPayment.findOne({ where: { publicId } });
    if (!payment) {
      return c.json({ error: "Payment not found" }, 404);
    }

    await payment.update({ backToStudent: true });

    return c.json(
      {
        message: "Payment marked as back to student successfully!",
        data: { id: payment.publicId },
      },
      200
    );
  } catch (error) {
    console.error("Error updating payment back to student:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
