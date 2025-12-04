import CourseVideo from "../../models/CourseVideo.js";
import Course from "../../models/Course.js";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const validateVideo = (body) => {
  const errors = {};

  if (!body.videoTitle || typeof body.videoTitle !== "string") {
    errors.videoTitle = "videoTitle must be a non-empty string";
  }

  if (isNaN(Number(body.videoDuration))) {
    errors.videoDuration = "videoDuration must be a valid number";
  }

  if (isNaN(Number(body.videoOrder))) {
    errors.videoOrder = "videoOrder must be a valid number";
  }

  return errors;
};

export const addVideo = async (c) => {
  try {
    const body = await c.req.parseBody();

    const { courseId, videoTitle, videoDuration, videoOrder } = body;
    const videoFile = body.videoUrl;

    if (
      !courseId ||
      !videoTitle ||
      videoDuration === undefined ||
      videoOrder === undefined ||
      !videoFile
    ) {
      return c.json({ message: "All fields are required" }, 400);
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return c.json({ message: "Course not found!" }, 404);
    }

    const errors = validateVideo(body);
    if (Object.keys(errors).length > 0) {
      return c.json({ errors }, 400);
    }

    const allowedTypes = [
      "application/mp4",
      "video/mp4",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/webm",
    ];

    if (!allowedTypes.includes(videoFile.type)) {
      return c.json(
        { error: "Only mp4, avi, mov, wmv or webm files are allowed" },
        400
      );
    }

    const ext = path.extname(videoFile.name) || ".mp4";
    const fileName = crypto.randomUUID() + ext;

    const uploadDir = path.join(process.cwd(), "courses", "videos");
    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await videoFile.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, fileName), buffer);

    const savedPath = `/courses/videos/${fileName}`;

    const newVideo = await CourseVideo.create({
      courseId,
      videoTitle,
      videoDuration: Number(videoDuration),
      videoOrder: Number(videoOrder),
      videoUrl: savedPath,
    });

    return c.json({
      success: "Video added successfully!",
      data: {
        id: newVideo.id,
        courseId: newVideo.courseId,
        videoTitle: newVideo.videoTitle,
        videoDuration: newVideo.videoDuration,
        videoOrder: newVideo.videoOrder,
        videoUrl: newVideo.videoUrl,
      },
    });
  } catch (error) {
    console.error("Add course video error: ", error);
    return c.json({ error: "Internal server error!" }, 500);
  }
};
