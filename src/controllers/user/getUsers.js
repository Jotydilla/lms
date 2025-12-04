import User from "../../models/User.js";
export const getUsers = async (c) => {
  try {
    const users = await User.findAll({
      where: { userType: "student" },
      attributes: [
        "public_id",
        "phone",
        "user_type",
        "is_verified",
        "status",
        "last_login",
        "createdAt",
        "updatedAt",
      ],
      order: [["user_id", "ASC"]],
    });
    if (!users || users.length === 0) {
      return c.json({ message: "No users found" }, 404);
    }

    const flatten = users.map((item) => {
      const row = item.toJSON();
      const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
      return {
        id: row.public_id,
        phone: row.phone,
        isVerified: row.is_verified,
        status: row.status,
        userType: row.user_type,
        lastLogin: formatDate(row.last_login),
        registerDate: formatDate(row.createdAt),
        updateDate: formatDate(row.updatedAt),
      };
    });

    return c.json({ user_data: flatten });
  } catch (error) {
    return c.json({ message: "Internal server error" }, 500);
  }
};
