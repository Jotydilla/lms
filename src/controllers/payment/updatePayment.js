import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Op } from "sequelize";
import StudentPayment from "../../models/StudentPayment.js";
import StudentClass from "../../models/StudentClass.js";
import Student from "../../models/Student.js";
import PaymentMethod from "../../models/PaymentMethod.js";

export const updatePayment = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const body = await c.req.parseBody();

    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const userId = user.userId;
    const student = await Student.findOne({ where: { userId } });
    if (!student) return c.json({ error: "You are not registered!" }, 400);
    const studentId = student.studentId;

    let { methodId, transactionNo, payMonth } = body;
    const receipt = body.receipt;

    // Validate required fields
    if (!methodId || !transactionNo || !payMonth || !receipt) {
      return c.json({ error: "All fields are required" }, 400);
    }

    // Validate types
    methodId = Number(methodId);
    payMonth = Number(payMonth);
    transactionNo = transactionNo.toString().trim().toUpperCase();

    if (isNaN(methodId) || methodId <= 0) {
      return c.json({ error: "Invalid payment method ID" }, 400);
    }

    if (isNaN(payMonth) || payMonth < 1 || payMonth > 4) {
      return c.json({ error: "Invalid payment month (1–4)" }, 400);
    }

    const payment = await StudentPayment.findOne({ where: { publicId } });
    if (!payment) return c.json({ error: "Payment not found" }, 404);

    if (!payment.backToStudent) {
      return c.json({ error: "Your payment is still pending for update" }, 400);
    }

    if (payment.paymentStatus) {
      return c.json({ error: "This payment has already been completed!" }, 400);
    }

    const studentClass = await StudentClass.findOne({
      where: { classId: payment.classId, studentId },
    });
    if (!studentClass) return c.json({ error: "Class not found" }, 404);

    const checkMethod = await PaymentMethod.findOne({
      where: { method_id: methodId, account_status: 0 },
    });
    if (!checkMethod) return c.json({ error: "Payment method not found" }, 404);

    // Ensure transaction number is unique
    const checkTransaction = await StudentPayment.findOne({
      where: { publicId: { [Op.ne]: publicId }, transaction_no: transactionNo },
    });
    if (checkTransaction)
      return c.json({ error: "Transaction number already used" }, 400);

    // Validate receipt type
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowedTypes.includes(receipt.type)) {
      return c.json(
        { error: "Only PDF, PNG, JPG, JPEG files are allowed" },
        400
      );
    }

    const ext = path.extname(receipt.name) || ".pdf";
    const newFileName = crypto.randomUUID() + ext;
    const uploadDir = path.join(process.cwd(), "images", "receipt");
    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await receipt.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, newFileName), buffer);

    // Delete old receipt if exists
    if (payment.receiptName) {
      try {
        const oldPath = path.join(uploadDir, payment.receiptName);
        await fs.unlink(oldPath);
      } catch {
        console.warn("Old receipt file not found, skipping delete");
      }
    }

    // Update payment record
    await payment.update({
      methodId: methodId,
      transactionNo: transactionNo,
      payMonth: payMonth,
      receipt: newFileName,
      backToStudent: false,
    });

    return c.json(
      {
        message: "Payment updated successfully!",
        data: { id: payment.publicId },
      },
      200
    );
  } catch (error) {
    console.error("Error updating payment:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
