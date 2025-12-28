import { DataTypes } from "sequelize";
import connection from "../config/database.js";
import Student from "./Student.js";
import Level from "./Level.js";

const StudentClass = connection.define(
  "Classes",
  {
    classId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "class_id",
    },
    publicId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      field: "public_id",
    },
    studentId: {
      type: DataTypes.INTEGER,
      references: { model: Student, key: "student_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "student_id",
    },
    levelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Level, key: "level_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "level_id",
    },
    criteriaFile: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "criteria_file",
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_approved",
    },
    joinDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "join_date",
    },
    lastPaymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "last_payment_date",
    },
    paidMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "paid_month",
    },
    paymentStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "payment_status",
    },
    finishedCourse: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "finished_course",
    },
    learningStatus: {
      type: DataTypes.ENUM("new", "current", "break", "finished"),
      defaultValue: "new",
      field: "learning_status",
    },
  },
  {
    tableName: "student_class",
    timestamps: true,
  }
);

// student relation
Student.hasMany(StudentClass, {
  foreignKey: "student_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
StudentClass.belongsTo(Student, { foreignKey: "student_id" });

// level relation
Level.hasMany(StudentClass, {
  foreignKey: "level_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
StudentClass.belongsTo(Level, { foreignKey: "level_id" });

export default StudentClass;
