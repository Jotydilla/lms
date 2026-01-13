import PublicCourse from "../../models/PublicCourse.js";

export const getPublicCourses = async (c) => {
  try {
    const publicCourses = await PublicCourse.findAll();
    if (!publicCourses || publicCourses.length === 0)
      return c.json({ message: "No courses found!!" }, 404);

    return c.json({ courses: publicCourses }, 200);
  } catch (error) {
    console.error("Get public course error", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
