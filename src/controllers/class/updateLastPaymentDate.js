import StudentClass from "../../models/StudentClass.js";

export const updateLastPaymentDate = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const { lastPaymentDate } = await c.req.json();

    if (!lastPaymentDate) {
      return c.json({ error: "lastPaymentDate is required" }, 400);
    }

    const parsedDate = new Date(lastPaymentDate);
    if (isNaN(parsedDate.getTime())) {
      return c.json({ error: "Invalid date format" }, 400);
    }

    const studentClass = await StudentClass.findOne({ where: { publicId } });

    if (!studentClass) {
      return c.json({ error: "Class not found" }, 404);
    }

    await studentClass.update({ lastPaymentDate: parsedDate });

    const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

    return c.json(
      {
        success: true,
        message: "Last payment date updated successfully",
        data: {
          classId: studentClass.publicId,
          lastPaymentDate: formatDate(studentClass.lastPaymentDate),
        },
      },
      200
    );
  } catch (error) {
    console.error("Update payment error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
