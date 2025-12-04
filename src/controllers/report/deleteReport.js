import Report from "../../models/Report.js";

export const deleteReport = async (c) => {
  try {
    const id = c.req.param("id");
    const report = await Report.findByPk(id);
    if (!report || report.length === 0) {
      return c.json({ message: "report not found!!" });
    }
    await report.destroy();
    return c.json({ message: "delete report successfully!" });
  } catch (error) {
    return c.json({ mesage: "Internal server error" });
  }
};
