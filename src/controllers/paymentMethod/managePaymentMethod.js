import PaymentMethod from "../../models/PaymentMethod.js";

export const managePaymentMethod = async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { accountStatus } = body;
    if (!accountStatus) {
      return c.json({ message: "account status required!!" });
    }
    if (accountStatus !== "0" && accountStatus !== "1") {
      return c.json({ message: "invalid account status!!" });
    }
    const paymentmethod = await PaymentMethod.findByPk(id);
    if (!paymentmethod || paymentmethod.length === 0) {
      return c.json({ message: "payment method id not found!!!" });
    }
    await paymentmethod.update({ accountStatus });
    return c.json({
      message: "Payment method status updated successfully!!",
      data: paymentmethod,
    });
  } catch (error) {
    return c.json({ message: "Internal Server error" });
  }
};
