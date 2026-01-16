import PublicCourseTopic from "../../models/PublicCourseTopic.js";

export const deleteTopic = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    if (!publicId) return c.json({ message: "Topic id is required!!" }, 400);

    const topic = await PublicCourseTopic.findOne({
      where: { publicId },
    });
    if (!topic || topic.length === 0)
      return c.json({ message: "Topic not found!!" });

    await topic.destroy();
    return c.json({ message: "delete topic  successfully!!" }, 200);
  } catch (error) {
    console.error("delete topic error", error);
    return c.json({ error: "Internal Server error" }, 500);
  }
};
