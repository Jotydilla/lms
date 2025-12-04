import { Hono } from "hono";
import * as CourseCommentController from "../controllers/courseComment/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validateMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STUDENT: "student",
};

const commentRoute = new Hono();

/**
 * ======================
 * ADMIN / MANAGER ROUTES
 * ======================
 */

// Get all comments
commentRoute.get(
  "/:courseId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  CourseCommentController.getComments
);

// Get comment by publicId
commentRoute.get(
  "/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  CourseCommentController.getComment
);

/**
 * ======================
 * STUDENT ROUTES
 * ======================
 */

// Add a new comment
commentRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, limit: 10 }),
  validate({
    courseId: { required: true },
    comment: { required: true },
  }),
  CourseCommentController.addComment
);

// Update a comment
commentRoute.put(
  "/update/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, limit: 10 }),
  CourseCommentController.updateComment
);

/**
 * ======================
 * MANAGER / STUDENT ROUTES
 * ======================
 */

// Delete a comment
commentRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.STUDENT]),
  CourseCommentController.deleteComment
);

export default commentRoute;
