import Report from "../../models/Report.js";
import User from "../../models/User.js";

export const addReport = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }
    const { report } = body;

    const user = c.get("user");

    if (!user) return c.json({ error: "unauthoried" });
    if (user.userType === "manager")
      return c.json({ error: "error, you haven't permission" });

    const userId = user.userId;

    const checkreport = await User.findByPk(userId);
    if (!checkreport) {
      return c.json({ message: "user id not found!!" });
    }
    if (!report || report.trim().length === 0) {
      return c.json({ message: "report must be required" }, 400);
    }

    // Check how many pending reports the user has
    const pendingCount = await Report.count({
      where: { user_id: userId, report_status: 0 },
    });

    if (pendingCount >= 2) {
      return c.json({ msg: "Too many reports, please wait..." });
    }

    // Check if the same report text already exists
    const repeatedReport = await Report.findOne({
      where: { user_id: userId, report },
    });

    if (repeatedReport) {
      return c.json({ msg: "You already submitted this report before!" });
    }

    await Report.create({ userId, report });
    return c.json(
      {
        message: "added new report successfully!",
      },
      201
    );
  } catch (error) {
    return c.json({ message: "Internal server error" }, 500);
  }
};
