import SystemInfo from "../../models/SystemInfo.js";

export const getSysteminfo = async (c) => {
  try {
    const id = c.req.param("id");
    const systeminfo = await SystemInfo.findOne({
      where: { system_id: id },
    });
    if (!systeminfo || systeminfo.length === 0) {
      return c.json({ message: "system id not found" });
    }
    return c.json({
      data: systeminfo,
    });
  } catch (error) {
    return c.json({ message: "Internal server error" });
  }
};
