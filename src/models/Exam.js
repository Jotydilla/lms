import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Course from "./Course.js";

const Exam = sequelize.define(
  "Exam",
  {
    examId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "exam_id",
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Course, key: "course_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "course_id",
    },
    examTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "exam_title",
    },
    // time limit in minute
    timeLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "time_limit",
    },
    totalMarks: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      field: "total_marks",
    },
  },
  {
    tableName: "exams",
    timestamps: true,
  }
);

// course relation
Course.hasMany(Exam, { foreignKey: "course_id" });
Exam.belongsTo(Course, { foreignKey: "course_id" });

export default Exam;
