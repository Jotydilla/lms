export const authorized = async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const format = (d) => {
      if (!d) return null;
      const date = new Date(d);
      return (
        date.getDate().toString().padStart(2, "0") +
        "-" +
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getFullYear() +
        " at " +
        date.getHours().toString().padStart(2, "0") +
        ":" +
        date.getMinutes().toString().padStart(2, "0") +
        ":" +
        date.getSeconds().toString().padStart(2, "0")
      );
    };

    const flat = {
      id: user.publicId,
      phone: user.phone,
      status: user.status,
      userType: user.userType,
      is_verified: user.is_verified,
      lastLogin: format(user.lastLogin),
      registerDate: format(user.createdAt),
      updateDate: format(user.updatedAt),
    };

    return c.json({ user: flat });
  } catch (error) {
    console.error("AUTHORIZED ERROR:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
