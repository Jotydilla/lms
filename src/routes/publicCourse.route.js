import { Hono } from "hono";
import * as PuclicCourseController from "../controllers/publicCourse/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const publicCourseRoute = new Hono();

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

publicCourseRoute.get(
  "/",
  // authMiddleware,
  // roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  PuclicCourseController.getPublicCourses
);

publicCourseRoute.get(
  "/:publicId",
  // authMiddleware,
  // roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  PuclicCourseController.getPublicCourse
);

publicCourseRoute.post(
  "/add",
  //   authMiddleware,
  //   roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  PuclicCourseController.addPublicCourse
);

publicCourseRoute.put(
  "/update/:publicId",
  //   authMiddleware,
  //   roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  PuclicCourseController.updatePublicCourse
);

publicCourseRoute.put(
  "/delete/:publicId",
  //   authMiddleware,
  //   roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  PuclicCourseController.deletePublicCourse
);

export default publicCourseRoute;
