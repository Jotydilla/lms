import { DataTypes } from "sequelize";
import connection from "../config/database.js";
import PaymentMethod from "./PaymentMethod.js";
import StudentClass from "./StudentClass.js";

const StudentPayment = connection.define(
  "StudentPayment",
  {
    paymentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "payment_id",
    },
    publicId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      field: "public_id",
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: StudentClass, key: "class_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "class_id",
    },
    methodId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: PaymentMethod, key: "method_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "method_id",
    },
    transactionNo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "transaction_no",
    },
    payMonth: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "pay_month",
    },
    receipt: { type: DataTypes.STRING, allowNull: false, unique: true },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "payment_date",
    },
    paymentStatus: {
      type: DataTypes.TINYINT,
      unique: false,
      defaultValue: 0,
      field: "payment_status",
    },
    backToStudent: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      field: "back_to_student",
    },
  },
  {
    tableName: "student_payment",
    timestamps: true,
  }
);

StudentClass.hasMany(StudentPayment, {
  foreignKey: "class_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
StudentPayment.belongsTo(StudentClass, {
  foreignKey: "class_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

PaymentMethod.hasMany(StudentPayment, {
  foreignKey: "method_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
StudentPayment.belongsTo(PaymentMethod, {
  foreignKey: "method_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

export default StudentPayment;
