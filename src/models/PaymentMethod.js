import { DataTypes } from "sequelize";
import connection from "../config/database.js";

const PaymentMethod = connection.define(
  "PaymentMethod",
  {
    methodId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "method_id",
    },
    methodName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "method_name",
    },
    holderName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "holder_name",
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "account_number",
    },
    accountStatus: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      field: "account_status",
    },
  },
  { tableName: "payment_method", timestamps: false }
);

export default PaymentMethod;
