import { DataTypes } from "sequelize";
import connection from "../config/database.js";
import User from "./User.js";

const Student = connection.define(
  "Student",
  {
    studentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "student_id",
    },
    publicId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
      field: "public_id",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "user_id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
      field: "user_id",
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      field: "first_name",
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      field: "middle_name",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      field: "last_name",
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 10,
          msg: "age must be > 10",
        },
      },
    },
    gender: { type: DataTypes.ENUM("male", "female"), allowNull: false },
    educationLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "aducation_level",
    },
    address: { type: DataTypes.STRING, allowNull: true },
    photo: { type: DataTypes.STRING, allowNull: false },
    churchName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "church_name",
    },
  },
  {
    tableName: "students",
    timestamps: true,
  }
);

User.hasOne(Student, {
  foreignKey: "user_id",
  onUpdate: "CASCADE",
  onDelete: "RESTRICT",
});
Student.belongsTo(User, { foreignKey: "user_id" });

Student.beforeCreate(async (student) => {
  const user = await User.findByPk(student.userId);
  if (!user) {
    throw new Error("User not found for this student record");
  }
  if (user.userType !== "student") {
    throw new Error(
      "Only users with 'student' type can create student records"
    );
  }
});

export default Student;
