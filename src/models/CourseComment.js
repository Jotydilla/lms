import sequlize from "../config/database.js";
import { DataTypes } from "sequelize";
import Course from "./Course.js";
import User from "./User.js";

const CourseComment = sequlize.define(
  "CourseComment",
  {
    commentId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "comment_id",
    },

    publicId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: true,
      unique: true,
      field: "public_id",
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "user_id" },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
      field: "user_id",
    },

    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Course, key: "course_id" },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "course_comment",
    timestamps: true,
  }
);

// user relation
User.hasMany(CourseComment, { foreignKey: "user_id" });
CourseComment.belongsTo(User, { foreignKey: "user_id" });

// course relation
Course.hasMany(CourseComment, { foreignKey: "course_id" });
CourseComment.belongsTo(Course, { foreignKey: "course_id" });

export default CourseComment;
