import PaymentMethod from "../../models/PaymentMethod.js";

export const getPaymentMethods = async (c) => {
  try {
    const paymentMethod = await PaymentMethod.findAll();
    if (!paymentMethod || paymentMethod.length === 0) {
      return c.json({ message: "payment not found!!" });
    }
    return c.json({ methods: paymentMethod });
  } catch (error) {
    return c.json({ error: "Internal Server error" });
  }
};
