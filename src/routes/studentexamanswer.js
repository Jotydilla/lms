import { Hono } from "hono";
import * as StudentExamAnswerController from "../controllers/studentExamAnswer/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STUDENT: "student",
};

const studentExamAnswerRoute = new Hono();

/**
 * ======================
 * MANAGER / ADMIN ROUTES
 * ======================
 */

// Get all student exam answers
studentExamAnswerRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  StudentExamAnswerController.getAnswers
);

// Get a single student exam answer by id
studentExamAnswerRoute.get(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  StudentExamAnswerController.getAnswer
);

/**
 * ======================
 * STUDENT ROUTES
 * ======================
 */

// Add a new student exam answer
studentExamAnswerRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  StudentExamAnswerController.addAnswer
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete a student exam answer
studentExamAnswerRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  StudentExamAnswerController.deleteAnswer
);

export default studentExamAnswerRoute;
