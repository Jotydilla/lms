import { Hono } from "hono";
import * as CourseController from "../controllers/course/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const courseRoute = new Hono();

courseRoute.get(
  "/",
  // authMiddleware,
  // roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseController.getCourses
);

courseRoute.get(
  "/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseController.getCourse
);

courseRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseController.addCourse
);

courseRoute.put(
  "/update/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  CourseController.updateCourse
);

courseRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  CourseController.deleteCourse
);

export default courseRoute;
