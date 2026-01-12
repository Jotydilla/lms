import Instructor from "../../models/Instructor.js";

export const getInstructor = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const instructor = await Instructor.findOne({
      where: { publicId },
    });
    if (!instructor || instructor.length === 0) {
      return c.json({ message: "Instructor not found!!" }, 404);
    }

    const flat = {
      instructorId: instructor.publicId,
      instructorName: instructor.instructorName,
      instructorInfo: instructor.instructorInfo,
      instructorProfile: instructor.instructorProfile,
    };

    return c.json({ instructor: flat }, 200);
  } catch (error) {
    console.error("get Instructors error: ", error);
    return c.json({ error: "Internal server error " }, 500);
  }
};
