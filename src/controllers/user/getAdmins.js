import User from "../../models/User.js";
import { Op } from "sequelize";
export const getAdmins = async (c) => {
  try {
    const user_data = await User.findAll({
      where: {
        [Op.or]: [{ userType: "admin" }, { userType: "manager" }],
      },
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
    });
    if (!user_data) {
      return c.json({ message: "User not found!!" }, 404);
    }
    const flatten = user_data.map((item) => {
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

    return c.json({ admins: flatten });
  } catch (error) {
    console.error(error);
    return c.text("Internal server error", 500);
  }
};
