import CourseVideo from "../../models/CourseVideo.js";
import Course from "../../models/Course.js";
import Level from "../../models/Level.js";

export const getVideos = async (c) => {
  try {
    const videos = await CourseVideo.findAll({
      include: [
        {
          model: Course,
          include: [{ model: Level }],
        },
      ],
      order: [["videoOrder", "ASC"]],
    });

    if (!videos.length) {
      return c.json({ success: "No videos found", courseVideos: [] }, 200);
    }

    const result = videos.map((item) => {
      const row = item.toJSON();
      const course = row.Course;
      const level = course?.Level;

      return {
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
    });

    return c.json({
      success: "Videos fetched successfully",
      courseVideos: result,
    });
  } catch (error) {
    console.error("get course video error:", error);
    return c.json({ error: "Internal server error!" }, 500);
  }
};
