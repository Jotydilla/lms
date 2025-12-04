import { DataTypes } from "sequelize";
import connection from "../config/database.js";

const User = connection.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "user_id",
    },
    publicId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      field: "public_id",
    },
    phone: { type: DataTypes.STRING(15), allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    userType: {
      type: DataTypes.ENUM("admin", "student", "manager", "teacher"),
      allowNull: false,
      defaultValue: "student",
      field: "user_type",
    },
    status: {
      type: DataTypes.ENUM("active", "inactive", "banned"),
      defaultValue: "active",
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      field: "last_login",
    },
    verificationCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "verification_code",
    },
    verificationExpires: {
      type: DataTypes.DATE(6),
      allowNull: true,
      field: "verification_expires",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);
export default User;
