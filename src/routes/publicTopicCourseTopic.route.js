import { Hono } from "hono";
import * as PuclicCourseTopicController from "../controllers/publicCourseTopic/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const publicCourseTopicRoute = new Hono();

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

publicCourseTopicRoute.get(
  "/",
  // authMiddleware,
  // roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  PuclicCourseTopicController.getPublicCourseTopics
);

publicCourseTopicRoute.get(
  "/:publicId",
  // authMiddleware,
  // roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  PuclicCourseTopicController.getPublicCourseTopic
);

publicCourseTopicRoute.post(
  "/add",
  //   authMiddleware,
  //   roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  PuclicCourseTopicController.addTopic
);

// publicCourseTopicRoute.put(
//   "/update/:publicId",
//   //   authMiddleware,
//   //   roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
//   PuclicCourseTopicController.updatePublicCourse
// );

// publicCourseTopicRoute.delete(
//   "/delete/:publicId",
//   //   authMiddleware,
//   //   roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
//   PuclicCourseTopicController.deletePublicCourse
// );

export default publicCourseTopicRoute;
