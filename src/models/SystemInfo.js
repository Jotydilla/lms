import { DataTypes } from "sequelize";
import connection from "../config/database.js";

const SystemInfo = connection.define(
  "SystemInfo",
  {
    systemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "system_id",
    },
    systemPhone: {
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: false,
      field: "system_phone",
    },
    systemEmail: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      field: "system_email",
    },
    Address: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      field: "address",
    },
  },
  {
    tableName: "system_information",
    timestamps: true,
  }
);

export default SystemInfo;
