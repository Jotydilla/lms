import User from "../../models/User.js";
import Report from "../../models/Report.js";
import Student from "../../models/Student.js";

export const deleteUser = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const user = await User.findOne({
      where: { publicId },
    });
    if (!user) {
      return c.text("User not found!", 404);
    }
    if (user.userType === "manager") {
      return c.json({ warning: "error, you haven't permission!!" });
    }
    const checkReport = await Report.findOne({
      where: { user_id: user.userId },
    });
    if (checkReport) {
      return c.json({ msg: "not delete user related with report" });
    }
    const checkStudent = await Student.findOne({
      where: { user_id: user.userId },
    });
    if (checkStudent) {
      return c.json({ msg: "not delete user related with student" });
    }
    await user.destroy();
    return c.json({ data: `deleted successfully!` });
  } catch (error) {
    return c.text("Internal server error", 500);
  }
};
