import StudentPayment from "../../models/StudentPayment.js";
import fs from "fs/promises";
import path from "path";

export const deletePayment = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const payment = await StudentPayment.findOne({ where: { publicId } });

    if (!payment) {
      return c.json({ error: "Payment not found" }, 404);
    }

    // Delete receipt file if exists
    if (payment.receipt) {
      try {
        const filePath = path.join(
          process.cwd(),
          "images",
          "receipt",
          payment.receipt
        );
        await fs.unlink(filePath);
      } catch {
        console.warn(
          "Receipt file not found or already deleted, skipping delete"
        );
      }
    }

    await payment.destroy();

    return c.json({ message: "Payment deleted successfully!" }, 200);
  } catch (error) {
    console.error("Error deleting payment:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
