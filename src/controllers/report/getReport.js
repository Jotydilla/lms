import Report from "../../models/Report.js";
import User from "../../models/User.js";

export const getReport = async (c) => {
  try {
    const id = c.req.param("id");
    const report = await Report.findByPk(id, {
      attributes: ["report_id", "report", "createdAt"],
      include: [{ model: User, attributes: ["phone"] }],
    });
    if (!report || report.length === 0) {
      return c.json({ message: "report not found!!" });
    }
    const row = report.toJSON();
    const formatDate = (date) => new Date(date).toISOString().slice(0, 10);
    const flatten = {
      reportId: row.report_id,
      report: row.report,
      userPhone: row.User?.phone,
      reportedAt: formatDate(row.createdAt),
    };

    return c.json({ report: flatten });
  } catch (error) {
    return c.json({ mesage: "Internal server error" });
  }
};
