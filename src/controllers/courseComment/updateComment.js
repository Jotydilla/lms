import CourseComment from "../../models/CourseComment.js";

export const updateComment = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (error) {
      return c.json({ error: "Invalid JSON format" });
    }

    const publicId = c.req.params?.publicId;
    if (!publicId) return c.json({ error: "Public ID is required" });

    const { comment } = body;
    if (!comment?.trim())
      return c.json({ message: "Comment field is required" });

    const course_comment = await CourseComment.findOne({ where: { publicId } });
    if (!course_comment) return c.json({ message: "Comment not found!" });

    await course_comment.update({ comment: comment.trim() });

    return c.json({
      success: "Comment updated successfully!",
      comment: {
        commentId: course_comment.publicId,
        comment: course_comment.comment,
      },
    });
  } catch (error) {
    console.error("Update comment error:", error);
    return c.json({ error: "Internal server error" });
  }
};
