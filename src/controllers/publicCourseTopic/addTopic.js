import PublicCourse from "../../models/PublicCourse.js";
import PublicCourseTopic from "../../models/PublicCourseTopic.js";

export const addTopic = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (error) {
      console.error("Invalid json body:", error);
      return c.json({ error: "Invalid JSON body " });
    }

    const { courseId, topic } = body;
    if (!courseId || !topic)
      return c.json({ message: "All field are required!!" }, 400);

    const checkPublicCourse = await PublicCourse.findOne({
      where: { id: courseId },
    });
    if (!checkPublicCourse || checkPublicCourse.length === 0)
      return c.json({ message: "Course id not found!!" }, 404);

    const checkDouble = await PublicCourseTopic.findOne({
      where: { courseId, topic },
    });
    if (checkDouble) return c.json({ message: "Topic already exist!!" }, 409);

    const newTopic = await PublicCourseTopic.create({
      courseId,
      topic,
    });
    return c.json(
      {
        message: "Added new topic successfully!!",
        topic: newTopic.topic,
      },
      200
    );
  } catch (error) {
    console.error("Add topic error", error);
    return c.json({ error: "Internal Server error" }, 500);
  }
};
