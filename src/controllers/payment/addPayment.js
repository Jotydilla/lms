import path from "path";
import crypto from "crypto";
import { promises as fs } from "fs";
import StudentClass from "../../models/StudentClass.js";
import PaymentMethod from "../../models/PaymentMethod.js";
import StudentPayment from "../../models/StudentPayment.js";
import Student from "../../models/Student.js";

const validatePayment = (body) => {
  const errors = {};
  const methodId = Number(body.methodId);
  const payMonth = Number(body.payMonth);

  if (isNaN(methodId)) errors.methodId = "methodId must be a valid number";
  if (!body.transactionNo || typeof body.transactionNo !== "string")
    errors.transactionNo = "transactionNo must be a non-empty string";
  if (isNaN(payMonth) || payMonth < 1 || payMonth > 4)
    errors.payMonth = "payMonth must be a number between 1 and 4";

  return errors;
};

export const addPayment = async (c) => {
  try {
    const body = await c.req.parseBody();

    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const student = await Student.findOne({ where: { userId: user.userId } });
    if (!student) return c.json({ error: "You are not registered!" });
    const studentId = student.studentId;

    let { publicId, methodId, transactionNo, payMonth, receipt } = body;

    const errors = validatePayment(body);
    if (Object.keys(errors).length > 0) return c.json({ errors }, 400);
    if (!publicId || !receipt)
      return c.json({ error: "All fields are required" }, 400);

    const classes = await StudentClass.findOne({
      where: { publicId, studentId },
    });
    if (!classes) return c.json({ error: "Class not found" }, 404);
    if (classes.learningStatus === "finished")
      return c.json({ message: "You have finished the class" });
    if (new Date(classes.lastPaymentDate) > new Date())
      return c.json({ message: "You still have remaining days" });

    const paymentMethod = await PaymentMethod.findOne({
      where: { methodId, accountStatus: 0 },
    });
    if (!paymentMethod)
      return c.json({ error: "Payment method not found" }, 404);

    const existingTransaction = await StudentPayment.findOne({
      where: { transaction_no: transactionNo },
    });
    if (existingTransaction)
      return c.json({ error: "Transaction number already exists" }, 400);

    transactionNo = transactionNo.toUpperCase();
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(receipt.type))
      return c.json(
        { error: "Only PDF, PNG, JPG, JPEG files are allowed" },
        400
      );

    const ext = path.extname(receipt.name) || ".pdf";
    const fileName = crypto.randomUUID() + ext;
    const uploadDir = path.join(process.cwd(), "images", "receipt");
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await receipt.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, fileName), buffer);

    const newPayment = await StudentPayment.create({
      classId: classes.classId,
      methodId,
      transactionNo,
      payMonth,
      receipt: fileName,
    });

    await classes.update({ paymentStatus: true });

    const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

    return c.json(
      {
        message: "Payment registered successfully!",
        data: {
          paymentId: newPayment.publicId,
          transactionNo: newPayment.transactionNo,
          payMonth: newPayment.payMonth,
          paymentDate: formatDate(newPayment.paymentDate),
        },
      },
      201
    );
  } catch (error) {
    console.error("Error adding payment:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
