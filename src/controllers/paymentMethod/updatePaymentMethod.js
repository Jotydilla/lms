import PaymentMethod from "../../models/PaymentMethod.js";

export const updatePaymentMethod = async (c) => {
  try {
    const body = await c.req.json();
    const id = c.req.param("id");
    const { methodName, holderName, accountNumber } = body;

    const paymentMethod = await PaymentMethod.findByPk(id);
    if (!paymentMethod || paymentMethod.length === 0) {
      return c.json({ message: "payment method id not found!!" });
    }
    const newData = {
      methodName,
      holderName,
      accountNumber,
    };
    const existingMethodname = await PaymentMethod.findOne({
      where: { methodName },
    });
    if (existingMethodname) {
      return c.json({ error: "Payment method already exists" }, 409);
    }
    const existingMethod = await PaymentMethod.findOne({
      where: { methodName, accountNumber },
    });
    if (existingMethod) {
      return c.json({ error: "Payment method already exists" }, 409);
    }

    await paymentMethod.update(newData);
    return c.json({
      message: "update payment method successfully!!",
      data: paymentMethod,
    });
  } catch (error) {
    return c.json({ message: "Internal Server error" });
  }
};
