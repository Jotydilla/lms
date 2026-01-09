import { DataTypes } from "sequelize";
import connection from "../config/database.js";
import User from "./User.js";

const VerificationSession = connection.define(
  "VerificationSession",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    verifyId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      field: "verify_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "user_id",
    },
    purpose: {
      type: DataTypes.ENUM("phone_verify", "password_reset"),
      allowNull: false,
    },
    otpHash: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "otp_hash",
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    expiresAt: {
      type: DataTypes.DATE(6),
      allowNull: false,
      field: "expires_at",
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_verified",
    },
  },
  {
    tableName: "verification_session",
    timestamps: true,
  }
);

User.hasMany(VerificationSession, {
  foreignKey: "userId",
});

VerificationSession.belongsTo(User, {
  foreignKey: "userId",
});

export default VerificationSession;
