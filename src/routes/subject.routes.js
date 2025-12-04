import { Hono } from "hono";
import * as subjectController from "../controllers/subject/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STUDENT: "student",
};

const subjectRoute = new Hono();

/**
 * ======================
 * PUBLIC ROUTES
 * ======================
 */

// Get all subjects
subjectRoute.get("/", authMiddleware, subjectController.getSubjects);

// Get a single subject by id
subjectRoute.get("/:id", authMiddleware, subjectController.getSubject);

/**
 * ======================
 * ADMIN / MANAGER ROUTES
 * ======================
 */

// Add a new subject
subjectRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validate({
    subjectName: { required: true, min: 2, max: 100 },
  }),
  subjectController.addSubject
);

// Update a subject
subjectRoute.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validate({
    subjectName: { required: true, min: 2, max: 100 },
  }),
  subjectController.updateSubject
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete a subject
subjectRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  subjectController.deleteSubject
);

export default subjectRoute;
