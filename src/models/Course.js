import { DataTypes } from "sequelize";
import Level from "./Level.js";
import sequelize from "../config/database.js";

const Course = sequelize.define(
  "Course",
  {
    courseId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "course_id",
    },
    publicId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      field: "public_id",
    },
    levelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Level, key: "level_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "level_id",
    },
    courseTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "course_title",
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    courseOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "course_order",
    },
    thumbnail: { type: DataTypes.STRING },
  },
  {
    tableName: "courses",
    timestamps: true,
  }
);

// level relation
Level.hasOne(Course, {
  foreignKey: "level_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Course.belongsTo(Level, { foreignKey: "level_id" });

export default Course;
