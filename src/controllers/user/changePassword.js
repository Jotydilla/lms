import bcrypt from "bcrypt";
import User from "../../models/User.js";

export const changePassword = async (c) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    let { oldPassword, newPassword, comfirmPassword } = body;
    if (!oldPassword || !newPassword || !comfirmPassword) {
      return c.json({ message: "All fields are required" }, 400);
    }
    if (
      oldPassword.length === 0 ||
      newPassword.length === 0 ||
      comfirmPassword.length === 0
    ) {
      return c.json({ message: "Fields cannot be empty" }, 400);
    }
    oldPassword = String(oldPassword).trim();
    newPassword = String(newPassword).trim();
    comfirmPassword = String(comfirmPassword).trim();

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return c.json({ error: "Old password is incorrect" }, 403);

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });

    return c.json({ message: "Password changed successfully" });
  } catch (error) {
    return c.text("Internal server error", 500);
  }
};
