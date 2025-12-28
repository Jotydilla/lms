import { Hono } from "hono";
import * as CourseController from "../controllers/course/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const courseRoute = new Hono();

/**
 * ======================
 * ADMIN / MANAGER ROUTES
 * ======================
 */

// Get all courses
courseRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseController.getCourses
);

// Get course by publicId
courseRoute.get(
  "/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseController.getCourse
);

// Add a new course
courseRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseController.addCourse
);

// Update course
courseRoute.put(
  "/update/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseController.updateCourse
);

// approve

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete course
courseRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  CourseController.deleteCourse
);

export default courseRoute;
