import SystemInfo from "../../models/SystemInfo.js";

export const updateSysteminfo = async (c) => {
  try {
    const body = await c.req.json();
    const { systemPhone, systemEmail } = body;
    const id = c.req.param("id");

    if (
      (!systemPhone || systemPhone.trim().length === 0) &&
      (!systemEmail || systemEmail.trim().length === 0)
    ) {
      return c.json({ message: "phone and email are required" }, 400);
    }

    const systeminfo = await SystemInfo.findOne({ where: { system_id: id } });
    if (!systeminfo) {
      return c.json({ message: "data not found!!" }, 404);
    }

    await systeminfo.update({ systemPhone, systemEmail });
    return c.json(
      {
        message: "updated successfully!!",
        phone: systeminfo.systemPhone,
        email: systeminfo.systemEmail,
      },
      200
    );
  } catch (error) {
    console.error("Error updating subject:", error);
    return c.json({ message: "Internal server error" }, 500);
  }
};
