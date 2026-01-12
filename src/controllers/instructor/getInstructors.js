import Instructor from "../../models/Instructor.js";

export const getInstructors = async (c) => {
  try {
    const instructors = await Instructor.findAll();
    if (!instructors || instructors.length === 0) {
      return c.json({ message: "Instructors not found!!" }, 404);
    }

    const flatten = instructors.map((instructor) => {
      const row = instructor.toJSON();

      return {
        instructorId: row.publicId,
        instructorName: row.instructorName,
        instructorInfo: row.instructorInfo,
        instructorProfile: row.instructorProfile,
      };
    });
    return c.json({ instructors: flatten }, 200);
  } catch (error) {
    console.error("get Instructors error: ", error);
    return c.json({ error: "Internal server error " }, 500);
  }
};
