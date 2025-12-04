import PaymentMethod from "../../models/PaymentMethod.js";

const validatePaymentMethod = (body) => {
  const errors = {};

  if (typeof body.methodName !== "string" || body.methodName.trim() === "") {
    errors.methodName = "methodName must be a non-empty string";
  }

  if (typeof body.holderName !== "string" || body.holderName.trim() === "") {
    errors.holderName = "holderName must be a non-empty string";
  }

  if (
    typeof body.accountNumber !== "string" ||
    body.accountNumber.trim() === "" ||
    !/^\d+$/.test(body.accountNumber)
  ) {
    errors.accountNumber = "accountNumber must be a non-empty numeric string";
  }

  return errors;
};

export const addPaymentMethod = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }
    const { methodName, holderName, accountNumber } = body;
    if (!methodName || !holderName || !accountNumber) {
      return c.json({ error: "All fields are required" }, 400);
    }

    const errors = validatePaymentMethod(body);

    if (Object.keys(errors).length > 0) {
      return c.json({ errors }, 400);
    }
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
    const newMethod = await PaymentMethod.create({
      methodName,
      holderName,
      accountNumber,
    });
    return c.json(
      {
        message: "Payment method added successfully",
        data: newMethod,
      },
      201
    );
  } catch (error) {
    console.error("Error adding payment method:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
