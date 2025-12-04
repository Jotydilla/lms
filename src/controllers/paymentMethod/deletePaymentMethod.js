import PaymentMethod from "../../models/PaymentMethod.js";
import StudentPayment from "../../models/StudentPayment.js";

export const deletePaymentMethod = async (c) => {
  try {
    const id = c.req.param("id");
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod || paymentMethod.length === 0) {
      return c.json({ message: "payment method id not found!!!" });
    }
    const checkRelation = await StudentPayment.findOne({
      where: { method_id: id },
    });
    if (checkRelation) {
      return c.json({ msg: "not delete method" });
    }
    await paymentMethod.destroy();
    return c.json({ message: "deleted successfully!!" });
  } catch (error) {
    return c.json({ message: "Internal Server error" });
  }
};
