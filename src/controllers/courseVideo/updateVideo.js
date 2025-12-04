import CourseVideo from "../../models/CourseVideo.js";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export const updateVideo = async (c) => {
  try {
    const publicId = c.req.param("publicId");
    const body = await c.req.parseBody();

    const video = await CourseVideo.findOne({ where: { publicId } });

    if (!video) {
      return c.json({ message: "Video not found" }, 404);
    }

    let { videoTitle, videoDuration, videoOrder, videoUrl: newFile } = body;

    const updateData = {};

    if (videoTitle) updateData.videoTitle = videoTitle;
    if (videoDuration !== undefined)
      updateData.videoDuration = Number(videoDuration);
    if (videoOrder !== undefined) updateData.videoOrder = Number(videoOrder);

    if (newFile && newFile.name) {
      const allowedTypes = [
        "video/mp4",
        "video/avi",
        "video/mov",
        "video/wmv",
        "video/webm",
      ];

      if (!allowedTypes.includes(newFile.type)) {
        return c.json(
          { error: "Only mp4, avi, mov, wmv or webm files are allowed" },
          400
        );
      }

      if (video.videoUrl) {
        const oldPath = path.join(process.cwd(), video.videoUrl);
        fs.unlink(oldPath).catch(() => {});
      }

      const ext = path.extname(newFile.name);
      const fileName = crypto.randomUUID() + ext;

      const uploadDir = path.join(process.cwd(), "courses", "videos");
      await fs.mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await newFile.arrayBuffer());
      await fs.writeFile(path.join(uploadDir, fileName), buffer);

      updateData.videoUrl = `/courses/videos/${fileName}`;
    }

    await video.update(updateData);

    return c.json({
      success: "Video updated successfully",
      updated: updateData,
    });
  } catch (error) {
    console.error("Update video error:", error);
    return c.json({ error: "Internal server error!" }, 500);
  }
};
