import Report from "../../models/Report.js";

export const expireReport = async (c) => {
  try {
    const id = c.req.param("id");
    const reportStatus = 1;
    const report = await Report.findByPk(id);
    if (!report) {
      return c.json({ message: "report not found!!" });
    }
    const updateData = {
      reportStatus,
    };
    await report.update(updateData);
    return c.json({
      message: "report updated successfully!",
    });
  } catch (error) {
    return c.json({ message: "internal server error" });
  }
};
