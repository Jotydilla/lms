import { DataTypes } from "sequelize";
import connection from "../config/database.js";

const Instructor = connection.define(
  "Instructor",
  {
    instructorId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "instructor_id",
    },
    publicId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      field: "public_id",
    },
    instructorName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      field: "instructor_name",
    },
    instructorInfo: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "instructor_info",
    },
    instructorProfile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "instructor_profile",
    },
  },
  {
    tableName: "instructors",
    timestamps: true,
  }
);

export default Instructor;
