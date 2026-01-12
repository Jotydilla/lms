import { Hono } from "hono";
import * as CourseCommentController from "../controllers/courseComment/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validateMiddleware.js";

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STUDENT: "student",
};

const commentRoute = new Hono();

commentRoute.get(
  "/:courseId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  CourseCommentController.getComments
);

commentRoute.get(
  "/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  CourseCommentController.getComment
);

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

commentRoute.put(
  "/update/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, limit: 10 }),
  CourseCommentController.updateComment
);

commentRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.STUDENT]),
  CourseCommentController.deleteComment
);

export default commentRoute;
