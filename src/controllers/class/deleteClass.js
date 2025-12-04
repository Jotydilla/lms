import StudentClass from "../../models/StudentClass.js";
import StudentPayment from "../../models/StudentPayment.js";

export const deleteClass = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const classToDelete = await StudentClass.findOne({ where: { publicId } });

    if (!classToDelete) {
      return c.json({ message: "Class not found" }, 404);
    }

    // Check if any payments are linked to this class
    const checkRelation = await StudentPayment.findOne({
      where: { classId: classToDelete.classId }, // use correct field
    });

    if (checkRelation) {
      return c.json(
        { message: "Cannot delete this class: linked payments exist" },
        400
      );
    }

    await classToDelete.destroy();
    return c.json({ message: "Deleted successfully!" }, 200);
  } catch (error) {
    console.error("deleteClass error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
