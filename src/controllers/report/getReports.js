import Report from "../../models/Report.js";
import User from "../../models/User.js";

export const getReports = async (c) => {
  try {
    const reports = await Report.findAll({
      attributes: ["report_id", "report", "createdAt"],
      include: [{ model: User, attributes: ["phone"] }],
    });
    if (!reports || reports.length === 0) {
      return c.json({ message: "report not founds" });
    }
    const flatten = reports.map((item) => {
      const row = item.toJSON();
      const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

      return {
        reportId: row.report_id,
        report: row.report,
        userPhone: row.User?.phone || null,
        reportedAt: formatDate(row.createdAt),
      };
    });
    return c.json({ reports: flatten });
  } catch (error) {
    return c.json({ mesage: "Internal server error" });
  }
};
