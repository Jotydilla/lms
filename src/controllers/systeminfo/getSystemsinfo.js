import SystemInfo from "../../models/SystemInfo.js";

export const getSystemsinfo = async (c) => {
  try {
    const systeminfo = await SystemInfo.findAll();
    if (!systeminfo || systeminfo.length === 0) {
      return c.json({ message: "data not found" });
    }
    return c.json({
      data: systeminfo,
    });
  } catch (error) {
    return c.json({ message: "Internal server error" });
  }
};
