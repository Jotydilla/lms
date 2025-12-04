import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Exam from "./Exam.js";
import StudentClass from "./StudentClass.js";

const Grades = sequelize.define(
  "Grades",
  {
    gradeId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "grade_id",
    },

    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: StudentClass, key: "class_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "class_id",
    },

    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Exam, key: "exam_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "exam_id",
    },

    totalMarksObtained: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "total_marks_obtained",
    },

    grade: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "grade",
    },
  },
  {
    tableName: "grades",
    timestamps: false,
  }
);

// exam relation
Exam.hasMany(Grades, {
  foreignKey: "exam_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Grades.belongsTo(Exam, { foreignKey: "exam_id" });

// class relation
StudentClass.hasMany(Grades, {
  foreignKey: "class_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Grades.belongsTo(StudentClass, { foreignKey: "class_id" });

export default StudentExamAnswers;

// studentAnswer, marksObtained
