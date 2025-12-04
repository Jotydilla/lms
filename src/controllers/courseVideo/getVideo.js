import CourseVideo from "../../models/CourseVideo.js";
import Course from "../../models/Course.js";
import Level from "../../models/Level.js";

export const getVideo = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const video = await CourseVideo.findOne({
      where: { publicId },
      include: [
        {
          model: Course,
          include: [{ model: Level }],
        },
      ],
    });

    if (!video) {
      return c.json({ message: "Video not found" }, 404);
    }

    const row = video.toJSON();
    const course = row.Course;
    const level = course?.Level;

    const flat = {
      videoId: row.publicId,
      levelName: level?.levelName || null,
      weekNumber: level?.weekNumber || null,
      courseTitle: course?.courseTitle || null,
      description: course?.description || null,
      courseOrder: course?.courseOrder || null,
      thumbnail: course?.thumbnail || null,
      videoTitle: row.videoTitle,
      videoUrl: row.videoUrl,
      videoDuration: row.videoDuration,
      videoOrder: row.videoOrder,
    };

    return c.json({
      success: "Video fetched successfully",
      courseVideo: flat,
    });
  } catch (error) {
    console.error("get course video error:", error);
    return c.json({ error: "Internal server error!" }, 500);
  }
};
