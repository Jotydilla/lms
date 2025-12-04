import CourseComment from "../../models/CourseComment.js";
import Course from "../../models/Course.js";

export const addComment = async (c) => {
  try {
    let body;
    try {
      body = await c.req.json();
    } catch (error) {
      return c.json({ error: "Invalid JSON format!" });
    }

    const user = c.get("user");
    if (!user) return c.json({ error: "Unauthorized" });

    if (user.userType !== "student")
      return c.json({ message: "you are not student!!" });

    let { courseId, comment } = body;
    if (!courseId || !comment?.trim()) {
      return c.json({ message: "All fields are required!" });
    }

    const course = await Course.findByPk(courseId);
    if (!course) return c.json({ message: "Course not found!" });

    const newData = {
      userId: user.userId,
      courseId,
      comment: comment.trim(),
    };

    const newComment = await CourseComment.create(newData);

    return c.json({
      success: "Comment added successfully!",
      data: {
        comment: newComment.comment,
      },
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return c.json({ error: "Internal server error!" });
  }
};
