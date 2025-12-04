import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import Student from "../../models/Student.js";
import User from "../../models/User.js";

const validateStudentData = (data) => {
  const errors = [];
  const isStringValid = (str) =>
    typeof str === "string" && str.trim().length > 0;

  if (!isStringValid(data.firstName))
    errors.push("firstName must be a non-empty string");
  if (!isStringValid(data.middleName))
    errors.push("middleName must be a non-empty string");
  if (!isStringValid(data.lastName))
    errors.push("lastName must be a non-empty string");

  const ageNumber = Number(data.age);
  if (!Number.isInteger(ageNumber) || ageNumber <= 0) {
    errors.push("age must be a positive integer");
  } else {
    data.age = ageNumber;
  }

  if (!["male", "female"].includes(data.gender))
    errors.push("gender must be 'male' or 'female'");
  if (!isStringValid(data.educationLevel))
    errors.push("educationLevel must be a non-empty string");
  if (!isStringValid(data.address))
    errors.push("address must be a non-empty string");
  if (!isStringValid(data.churchName))
    errors.push("churchName must be a non-empty string");

  return errors;
};

export const addStudent = async (c) => {
  try {
    const body = await c.req.parseBody();
    const {
      firstName,
      middleName,
      lastName,
      age,
      gender,
      educationLevel,
      address,
      churchName,
      photo: photoFile,
    } = body;

    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !age ||
      !gender ||
      !educationLevel ||
      !address ||
      !churchName ||
      !photoFile
    ) {
      return c.json({ error: "All fields are required" }, 400);
    }

    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    if (user.userType !== "student")
      return c.json({ error: "You are not a student" }, 403);

    const errors = validateStudentData(body);
    if (errors.length > 0)
      return c.json({ error: "Validation failed", details: errors }, 400);

    const actived = await User.findOne({
      where: { user_id: user.userId, status: "active" },
    });
    if (!actived) return c.json({ error: "User must be active" }, 403);

    const existingStudent = await Student.findOne({
      where: { userId: user.userId },
    });
    if (existingStudent)
      return c.json({ error: "You are already registered" }, 400);

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(photoFile.type))
      return c.json({ error: "Only JPG or PNG images allowed" }, 400);

    const ext = photoFile.type === "image/png" ? "png" : "jpg";
    const newFileName = `${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "images", "profiles");
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await photoFile.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, newFileName), buffer);

    const newStudent = await Student.create({
      userId: user.userId,
      firstName,
      middleName,
      lastName,
      age: body.age,
      gender,
      educationLevel,
      address,
      churchName,
      photo: newFileName,
    });

    return c.json(
      { message: "Registered successfully!", data: newStudent },
      201
    );
  } catch (error) {
    console.error("Error adding student:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};
