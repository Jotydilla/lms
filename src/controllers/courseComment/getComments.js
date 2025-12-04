import CourseComment from "../../models/CourseComment.js";
import User from "../../models/User.js";
import Student from "../../models/Student.js";

export const getComments = async (c) => {
  try {
    const courseId = c.req.param("courseId");
    if (!courseId) return c.json({ error: "Course ID is required" });

    const comments = await CourseComment.findAll({
      where: { courseId },
      include: [{ model: User, include: [{ model: Student }] }],
    });
    if (!comments || comments.length === 0)
      return c.json({ message: "No comments found!" });

    return c.json({
      comments: comments.map((cmt) => ({
        commentId: cmt.publicId,
        courseId: cmt.courseId,
        comment: cmt.comment,
        firstName: cmt.User?.Student?.firstName,
      })),
    });
  } catch (error) {
    console.error("Get comments error:", error);
    return c.json({ error: "Internal server error" });
  }
};
