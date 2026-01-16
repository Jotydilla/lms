import StudentClass from "../../models/StudentClass.js";

export const learningStatusClass = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const body = await c.req.json();
    const { learningStatus } = body;

    if (learningStatus == null) {
      return c.json({ msg: "learningStatus is required!" }, 400);
    }

    const allowedStatuses = ["break", "current", "finished"];
    if (!allowedStatuses.includes(learningStatus)) {
      return c.json({ msg: "Invalid learningStatus value!" }, 400);
    }

    const select_class = await StudentClass.findOne({ where: { publicId } });
    if (!select_class) {
      return c.json({ msg: "Class not found", success: false }, 404);
    }

    await select_class.update({ learningStatus });

    return c.json(
      {
        success: true,
        message: "Learning status updated successfully",
        data: {
          id: select_class.publicId,
          status: select_class.learningStatus,
        },
      },
      200
    );
  } catch (error) {
    console.error("learningStatusClass error:", error);
    return c.json({ msg: "Internal Server Error" }, 500);
  }
};
