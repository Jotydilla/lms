import { Hono } from "hono";
import * as ExamController from "../controllers/exam/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const examRoute = new Hono();

/**
 * ======================
 * ADMIN / MANAGER ROUTES
 * ======================
 */

// Get all exams
examRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamController.getExams
);

// Get exam by id
examRoute.get(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamController.getExam
);

// Add a new exam
examRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamController.addExam
);

// Update exam
examRoute.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamController.updateExam
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete exam
examRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  ExamController.deleteExam
);

export default examRoute;
