import PublicCourse from "../../models/PublicCourse.js";

export const getPublicCourse = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const publicCourse = await PublicCourse.findOne({ where: { publicId } });
    if (!publicCourse || publicCourse.length === 0)
      return c.json({ message: "No course found!!" }, 404);

    return c.json(
      {
        course: {
          id: publicCourse.publicId,
          courseTitle: publicCourse.courseTitle,
          description: publicCourse.description,
          instructorName: publicCourse.instructorName,
          creditHr: publicCourse.creditHr,
          thumbnail: publicCourse.thumbnail,
        },
      },
      200
    );
  } catch (error) {
    console.error("Get public course error", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
