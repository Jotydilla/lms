export const deleteVideo = async (c) => {
  try {
    const publicId = c.req.param("publicId");

    const video = await CourseVideo.findOne({ where: { publicId } });

    if (!video) {
      return c.json({ message: "Video not found" }, 404);
    }

    if (video.videoUrl) {
      const filePath = path.join(process.cwd(), video.videoUrl);
      fs.unlink(filePath).catch(() => {});
    }

    await video.destroy();

    return c.json({
      success: "Video deleted successfully",
      deletedId: publicId,
    });
  } catch (error) {
    console.error("Delete video error:", error);
    return c.json({ error: "Internal server error!" }, 500);
  }
};
