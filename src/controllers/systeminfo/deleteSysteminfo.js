import SystemInfo from "../../models/SystemInfo.js";

export const deleteSysteminfo = async (c) => {
  try {
    const id = c.req.param("id");
    const system = await SystemInfo.findByPk(id);
    if (!system || checkSysteminfo.length === 0) {
      return c.json({ message: "system id not fund" });
    }
    await system.destroy();
    return c.json({ message: "deleted successfuly!!" });
  } catch (error) {
    return c.json({ message: "Internal server Error" });
  }
};
