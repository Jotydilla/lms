import PaymentMethod from "../../models/PaymentMethod.js";

export const getPaymentMethod = async (c) => {
  try {
    const id = c.req.param("id");
    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod || paymentMethod.length === 0) {
      return c.json({ message: "payment not found!!" });
    }
    return c.json({ method: paymentMethod });
  } catch (error) {
    return c.json({ error: "Internal Server error" });
  }
};
