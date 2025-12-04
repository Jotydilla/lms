import { Hono } from "hono";
import * as ExamQuestionController from "../controllers/examQuestion/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const examQuestionRoute = new Hono();

/**
 * ======================
 * ADMIN / MANAGER ROUTES
 * ======================
 */

// Get all questions
examQuestionRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamQuestionController.getQuestions
);

// Get question by id
examQuestionRoute.get(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamQuestionController.getQuestion
);

// Add a new question
examQuestionRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamQuestionController.addQuestion
);

// Update a question
examQuestionRoute.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamQuestionController.updateQuestion
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete a question
examQuestionRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  ExamQuestionController.deleteQuestion
);

export default examQuestionRoute;
