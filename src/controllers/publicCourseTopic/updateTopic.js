import PublicCourseTopic from "../../models/PublicCourseTopic.js";

export const updateTopic = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (error) {
      console.error("Invalid json body:", error);
      return c.json({ error: "Invalid JSON body " });
    }

    const publicId = c.req.param("publicId");

    const { topic } = body;
    if (!topic) return c.json({ message: "All field are required!!" }, 400);

    const Topic = await PublicCourseTopic.findOne({
      where: { publicId },
    });
    if (!Topic || Topic.length === 0)
      return c.json({ message: "Topic id not found!!" }, 404);

    const checkDouble = await PublicCourseTopic.findOne({
      where: { publicId, topic },
    });
    if (checkDouble) return c.json({ message: "Topic already exist!!" }, 409);

    await Topic.update({
      topic,
    });
    return c.json(
      {
        message: "Updated  topic successfully!!",
        topic: Topic.topic,
      },
      200
    );
  } catch (error) {
    console.error("update topic error", error);
    return c.json({ error: "Internal Server error" }, 500);
  }
};
