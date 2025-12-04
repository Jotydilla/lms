import CourseComment from "../../models/CourseComment.js";

export const getComment = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    if (!publicId) return c.json({ error: "Public ID is required" });

    const comment = await CourseComment.findOne({ where: { publicId } });
    if (!comment) return c.json({ message: "Comment not found!" });

    return c.json({
      comment: {
        commentId: comment.publicId,
        courseId: comment.courseId,
        comment: comment.comment,
      },
    });
  } catch (error) {
    console.error("Get comment error:", error);
    return c.json({ error: "Internal server error" });
  }
};
