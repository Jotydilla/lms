import { Hono } from "hono";
import * as CourseVideoController from "../controllers/courseVideo/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const courseVideoRoute = new Hono();

/**
 * ======================
 * ADMIN / MANAGER ROUTES
 * ======================
 */

// Get all courses
courseVideoRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseVideoController.getVideos
);

// Get course by publicId
courseVideoRoute.get(
  "/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseVideoController.getVideo
);

// Add a new course
courseVideoRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseVideoController.addVideo
);

// Update course
courseVideoRoute.put(
  "/update/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseVideoController.updateVideo
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete course
courseVideoRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  CourseVideoController.deleteVideo
);

export default courseVideoRoute;
