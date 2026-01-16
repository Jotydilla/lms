import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Exam from "./Exam.js";
import StudentClass from "./StudentClass.js";
import ExamQuestion from "./ExamQuestion.js";

const StudentExamAnswers = sequelize.define(
  "StudentExamAnswers",
  {
    examAnswerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "exam_answer_id",
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
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: ExamQuestion, key: "question_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "question_id",
    },
    studentAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "student_answer",
    },
  },
  {
    tableName: "student_exam_answers",
    timestamps: false,
  }
);

Exam.hasMany(StudentExamAnswers, {
  foreignKey: "exam_id",
});
StudentExamAnswers.belongsTo(Exam, { foreignKey: "exam_id" });

StudentClass.hasMany(StudentExamAnswers, {
  foreignKey: "class_id",
});
StudentExamAnswers.belongsTo(StudentClass, { foreignKey: "class_id" });

ExamQuestion.hasMany(StudentExamAnswers, {
  foreignKey: "exam_id",
});
StudentExamAnswers.belongsTo(ExamQuestion, { foreignKey: "question_id" });

export default StudentExamAnswers;
