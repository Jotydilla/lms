import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import CourseVideo from "./CourseVideo.js";
import StudentClass from "./StudentClass.js";

const StudentProgress = sequelize.define(
  "StudentProgress",
  {
    progressId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "progress_id",
    },

    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: StudentClass, key: "class_id" },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
      field: "class_id",
    },

    courseVideoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: CourseVideo, key: "course_video_id" },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
      field: "course_video_id",
    },

    progress: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: { min: 0, max: 100 },
    },

    watched: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    lastWatchedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_watched_at",
    },
  },
  {
    tableName: "student_progress",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["class_id", "course_video_id"],
      },
    ],
  }
);

// Associations

StudentClass.hasMany(StudentProgress, { foreignKey: "classId" });
StudentProgress.belongsTo(StudentClass, { foreignKey: "classId" });

CourseVideo.hasMany(StudentProgress, { foreignKey: "courseVideoId" });
StudentProgress.belongsTo(CourseVideo, { foreignKey: "courseVideoId" });

export default StudentProgress;
