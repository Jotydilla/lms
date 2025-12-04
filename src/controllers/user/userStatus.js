import User from "../../models/User.js";

export const userStatus = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }
    const { status } = body;
    const allowedStatus = ["active", "inactive", "banned"];
    if (!allowedStatus.includes(status)) {
      return c.json(
        { error: "Status must be 'active', 'inactive', or 'banned'" },
        400
      );
    }
    const user = await User.findOne({ where: { publicId } });
    if (!user) {
      return c.json({ msg: "User not found" }, 404);
    }
    if (!user.userType == "student") {
      return c.json({ warning: "you haven't permission" });
    }
    await user.update({ status });
    return c.json({
      success: "Updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
