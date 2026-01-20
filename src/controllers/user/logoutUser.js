import userSession from "../../models/userSession.js";

export const logoutUser = async (c) => {
  try {
    const user = c.get("user");
    const refreshToken = c.req.cookie("refreshToken");

    if (refreshToken) {
      await userSession.update(
        { isRevoked: true },
        { where: { userId: user.publicId, refreshToken } },
      );
    }

    c.header("Set-Cookie", [
      "accessToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None",
      "refreshToken=; HttpOnly; Path=/; Max-Age=0; SameSite=None",
    ]);

    return c.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
};
