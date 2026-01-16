import PublicCourse from "../../models/PublicCourse.js";
import PublicCourseTopic from "../../models/PublicCourseTopic.js";

export const getPublicCourseTopics = async (c) => {
  try {
    const topics = await PublicCourseTopic.findAll({
      include: [{ model: PublicCourse }],
    });
    if (!topics || topics.length === 0)
      return c.json({ message: "Topics naot found!!" }, 404);

    const flatten = topics.map((item) => {
      const row = item.toJSON();
      return {
        id: row.publicId,
        courseId: row.PublicCourse?.publicId,
        topic: row.topic,
      };
    });

    return c.json({ topics: flatten }, 200);
  } catch (error) {
    console.error("Get public courses error: ", error);
    return c.json({ error: "Internal server Error" }, 500);
  }
};
