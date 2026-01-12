import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PublicCourse = sequelize.define(
  "PublicCourse",
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
    courseTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "course_title",
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    instructorName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "instructor_name",
    },
    creditHr: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "credit_hr",
    },
    thumbnail: { type: DataTypes.STRING },
  },
  {
    tableName: "public_course",
  }
);

export default PublicCourse;
