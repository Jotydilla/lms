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

// exam relation
Exam.hasMany(StudentExamAnswers, {
  foreignKey: "exam_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
StudentExamAnswers.belongsTo(Exam, { foreignKey: "exam_id" });

// class relation
StudentClass.hasMany(StudentExamAnswers, {
  foreignKey: "class_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
StudentExamAnswers.belongsTo(StudentClass, { foreignKey: "class_id" });

// examquestion relation
ExamQuestion.hasMany(StudentExamAnswers, {
  foreignKey: "exam_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
StudentExamAnswers.belongsTo(ExamQuestion, { foreignKey: "question_id" });

export default StudentExamAnswers;

// studentAnswer, marksObtained
