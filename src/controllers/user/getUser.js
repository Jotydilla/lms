import User from "../../models/User.js";
export const getUser = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const user_data = await User.findOne({
      where: { publicId, userType: "student" },
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
    const row = user_data.toJSON();
    const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
    const flat = {
      id: row.public_id,
      phone: row.phone,
      isVerified: row.is_verified,
      status: row.status,
      userType: row.user_type,
      lastLogin: formatDate(row.last_login),
      registerDate: formatDate(row.createdAt),
      updateDate: formatDate(row.updatedAt),
    };

    return c.json({ user: flat });
  } catch (error) {
    console.error(error);
    return c.text("Internal server error", 500);
  }
};
