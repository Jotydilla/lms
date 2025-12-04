import Student from "../../models/Student.js";

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
    errors.push("age must be a positive integer number");
  } else {
    data.age = ageNumber;
  }

  const allowedGender = ["male", "female"];
  if (!allowedGender.includes(data.gender)) {
    errors.push("gender must be either 'male' or 'female'");
  }

  if (!isStringValid(data.educationLevel))
    errors.push("educationLevel must be a non-empty string");

  if (!isStringValid(data.address))
    errors.push("address must be a non-empty string");

  if (!isStringValid(data.churchName))
    errors.push("churchName must be a non-empty string");

  return errors;
};

export const updateStudent = async (c) => {
  try {
    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    if (user.userType !== "student")
      return c.json({ error: "You are not a student" }, 403);

    const userId = user.userId;
    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return c.json({ error: "You are not registered!" }, 404);
    }

    const body = await c.req.json();
    const errors = validateStudentData(body);
    if (errors.length > 0) {
      return c.json({ error: "Validation failed", details: errors }, 400);
    }

    const {
      firstName,
      middleName,
      lastName,
      age,
      gender,
      educationLevel,
      address,
      churchName,
    } = body;

    await student.update({
      firstName,
      middleName,
      lastName,
      age,
      gender,
      educationLevel,
      address,
      churchName,
    });

    return c.json({
      message: "Updated successfully!",
      updatedData: {
        studentId: student.publicId,
        firstName: student.firstName,
        middleName: student.middleName,
        lastName: student.lastName,
        age: student.age,
        gender: student.gender,
        educationLevel: student.educationLevel,
        address: student.address,
        churchName: student.churchName,
      },
    });
  } catch (err) {
    console.error("Update error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
