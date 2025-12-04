import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Exam from "./Exam.js";

const ExamQuestion = sequelize.define(
  "ExamQuestion",
  {
    questionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "question_id",
    },

    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Exam, key: "exam_id" },
      onDelete: "RISTRICT",
      onUpdate: "CASCADE",
      field: "exam_id",
    },

    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "question_text",
    },

    optionA: { type: DataTypes.STRING, field: "option_a", allowNull: false },
    optionB: { type: DataTypes.STRING, field: "option_b", allowNull: false },
    optionC: { type: DataTypes.STRING, field: "option_c", allowNull: true },
    optionD: { type: DataTypes.STRING, field: "option_d", allowNull: true },
    correctOption: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "correct_option",
    },
    marks: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  {
    tableName: "exam_questions",
    timestamps: false,
  }
);

// exam relation
Exam.hasMany(ExamQuestion, { foreignKey: "exam_id" });
ExamQuestion.belongsTo(Exam, { foreignKey: "exam_id" });

export default ExamQuestion;
