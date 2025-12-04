import { DataTypes } from "sequelize";
import connection from "../config/database.js";

const Subject = connection.define(
  "Subject",
  {
    subjectId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "subject_id",
    },
    subjectName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "subject_name",
    },
  },
  {
    tableName: "subjects",
    timestamps: true,
  }
);

export default Subject;
