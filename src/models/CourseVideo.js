import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Course from "./Course.js";

const CourseVideo = sequelize.define(
  "CourseVideo",
  {
    courseVideoId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "course_video_id",
    },
    publicId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      field: "public_id",
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Course, key: "course_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "course_id",
    },
    videoTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "video_title",
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "video_url",
    },
    videoDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "video_duration",
    },
    videoOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "video_order",
    },
  },
  {
    tableName: "course_videos",
    timestamps: true,
  }
);

// course relation
Course.hasMany(CourseVideo, { foreignKey: "course_id" });
CourseVideo.belongsTo(Course, { foreignKey: "course_id" });

export default CourseVideo;
