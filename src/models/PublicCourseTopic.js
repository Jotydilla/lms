import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import PublicCourse from "./PublicCourse.js";

const PublicCourseTopic = sequelize.define(
  "PublicCourseTopic",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    publicId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      field: "public_id",
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: PublicCourse, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "course_id",
    },
    topic: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "public_course_topic",
  }
);

export default PublicCourseTopic;
