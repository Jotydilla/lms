import bcrypt from "bcrypt";
import User from "../../models/User.js";

export const updateUser = async (c) => {
  try {
    const body = await c.req.json();
    const publicId = c.req.param("publicId");
    let { phone, password } = body;
    if (!phone || !password) {
      return c.json({ error: "Phone and password are required" }, 400);
    }

    const errors = [];
    if (!phone || !/^[0-9]{9,15}$/.test(phone)) errors.push("Invalid phone");
    if (!password || password.trim() === "") errors.push("Password required");

    if (errors.length > 0)
      return c.json({ error: "Validation failed", details: errors }, 400);

    password = String(password).trim();
    if (password.length === 0) {
      return c.json({ error: "Password cannot be empty" }, 400);
    }

    const user = await User.findOne({
      where: { public_id: publicId },
    });
    if (!user) {
      return c.json({ message: "User not found!" }, 404);
    }
    if (user.userType == "manager") {
      return c.json({ warning: "you haven't a permission to change password" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const updateData = {
      phone,
      password: hashed,
    };
    await user.update(updateData);
    return c.json({ message: "updated successfully!!" });
  } catch (error) {
    return c.text("Internal server error", 500);
  }
};
