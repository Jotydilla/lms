import { DataTypes } from "sequelize";
import connection from "../config/database.js";
import User from "./User.js";

const Report = connection.define(
  "Report",
  {
    reportId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "report_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "user_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "user_id",
    },
    report: { type: DataTypes.TEXT, allowNull: false, defaultValue: false },
    reportStatus: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      allowNull: false,
      field: "report_status",
    },
  },
  { tableName: "reports", timestamps: true }
);

User.hasMany(Report, {
  foreignKey: "user_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Report.belongsTo(User, { foreignKey: "user_id" });

Report.beforeCreate(async (report) => {
  const user = await User.findByPk(report.userId);
  if (!user) {
    throw new Error("User not found for this report record");
  }
});

export default Report;
