import CourseComment from "../../models/CourseComment.js";

export const deleteComment = async (c) => {
  try {
    const publicId = c.req.params?.publicId;
    if (!publicId) return c.json({ error: "Public ID is required" });

    const comment = await CourseComment.findOne({ where: { publicId } });
    if (!comment) return c.json({ message: "Comment not found!" });

    await comment.destroy();

    return c.json({
      success: "Comment deleted successfully!",
    });
  } catch (error) {
    console.error("Deleting comment error:", error);
    return c.json({ error: "Internal server error" });
  }
};
