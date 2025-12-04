import User from "../../models/User.js";
export const authorized = async (c) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const userId = user.userId;

    const user_data = await User.findByPk(userId, {
      attributes: [
        "public_id",
        "phone",
        "user_type",
        "status",
        "last_login",
        "createdAt",
        "updatedAt",
      ],
    });
    if (!user_data) {
      return c.json({ message: "User not found!!" }, 404);
    }
    const row = user_data.toJSON();
    const format = (d) => {
      const date = new Date(d);
      return (
        date.getDate().toString().padStart(2, "0") +
        "-" +
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getFullYear() +
        " at " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
      );
    };
    const flat = {
      id: row.publicId,
      phone: row.phone,
      status: row.status,
      userType: row.user_type,
      lastLogin: format(row.last_login),
      registerDate: format(row.createdAt),
      updateDate: format(row.updatedAt),
    };

    return c.json({ user: flat });
  } catch (error) {
    console.error(error);
    return c.text("Internal server error", 500);
  }
};
