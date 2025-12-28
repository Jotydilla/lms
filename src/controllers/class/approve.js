import Level from "../../models/Level.js";
import StudentClass from "../../models/StudentClass.js";

export const approveClass = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const myClass = await StudentClass.findOne({
      where: { publicId },
    });
    if (!myClass) return c.json({ error: "Class not found" }, 404);

    await myClass.update({
      isApproved: true,
    });
    await myClass.reload({ include: [Level] });

    return c.json(
      {
        success: true,
        message: "Class approved successfully!",
      },
      200
    );
  } catch (error) {
    console.error("Error updating class:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
