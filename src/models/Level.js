import { DataTypes } from "sequelize";
import connection from "../config/database.js";
import Subject from "./Subject.js";

const Level = connection.define(
  "Level",
  {
    levelId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "level_id",
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Subject, key: "subject_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "subject_id",
    },
    levelName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "level_name",
    },
    paymentAmmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: "payment_ammount",
    },
    weekNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 7, // weekly(7), daily(1), monthly(30)
      field: "week_number",
    },
  },
  {
    tableName: "levels",
    timestamps: true,
  }
);

Subject.hasOne(Level, {
  foreignKey: "subject_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Level.belongsTo(Subject, { foreignKey: "subject_id" });

Level.beforeCreate(async (level) => {
  const subject = await Subject.findByPk(level.subjectId);
  if (!subject) {
    throw new Error("Subject not found for this level record");
  }
});

export default Level;
