import PublicCourse from "../../models/PublicCourse.js";
import PublicCourseTopic from "../../models/PublicCourseTopic.js";

export const getPublicCourseTopic = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const topic = await PublicCourseTopic.findOne({
      where: { publicId },
      include: [{ model: PublicCourse }],
    });
    if (!topic || topic.length === 0)
      return c.json({ message: "Topic not found!!" }, 404);

    const row = topic.toJSON();
    const flat = {
      id: row.publicId,
      courseId: row.PublicCourse?.publicId,
      topic: row.topic,
    };

    return c.json({ topics: flat }, 200);
  } catch (error) {
    console.error("Get public courses error: ", error);
    return c.json({ error: "Internal server Error" }, 500);
  }
};
