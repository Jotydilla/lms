import { Hono } from "hono";
import * as InstructorController from "../controllers/instructor/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const instructorRoute = new Hono();

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

instructorRoute.post(
  "/add",
  // authMiddleware,
  //   roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  InstructorController.addInstructor
);

instructorRoute.get(
  "/",
  // authMiddleware,
  // roleMiddleware,
  InstructorController.getInstructors
);
instructorRoute.get(
  "/:publicId",
  // authMiddleware,
  // roleMiddleware,
  InstructorController.getInstructor
);
instructorRoute.put(
  "/:publicId",
  // authMiddleware,
  // roleMiddleware,
  InstructorController.updateInstructor
);
instructorRoute.delete(
  "/:publicId",
  // authMiddleware,
  // roleMiddleware,
  InstructorController.deleteInstructor
);

export default instructorRoute;
