import { DataTypes } from "sequelize";
import connection from "../config/database.js";

const userSession = connection.define(
  "UserSession",
  {
    sessionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "session_id",
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "user_id",
    },

    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "refresh_token",
    },

    fingerprint: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },

    deviceId: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "device_id",
    },

    deviceName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "device_name",
    },

    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "ip_address",
    },

    userAgent: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "user_agent",
    },

    lastUsedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_used_at",
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
    },

    isRevoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_revoked",
    },
  },
  {
    tableName: "user_sessions",
    timestamps: true,
  }
);

export default userSession;
