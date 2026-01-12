import { Hono } from "hono";
import * as ExamController from "../controllers/exam/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const examRoute = new Hono();

examRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamController.getExams
);

examRoute.get(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamController.getExam
);

examRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamController.addExam
);

examRoute.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ExamController.updateExam
);

examRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  ExamController.deleteExam
);

export default examRoute;
