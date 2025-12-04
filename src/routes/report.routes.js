import { Hono } from "hono";
import * as reportController from "../controllers/report/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { rateLimit } from "../middleware/rateLimit.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STUDENT: "student",
};

const reportRoute = new Hono();

/**
 * ======================
 * MANAGER / ADMIN ROUTES
 * ======================
 */

// Get all reports
reportRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  reportController.getReports
);

// Get report by id
reportRoute.get(
  "/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  reportController.getReport
);

// Expire report
reportRoute.put(
  "/expire/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  reportController.expireReport
);

/**
 * ======================
 * ADMIN / STUDENT ROUTES
 * ======================
 */

// Add report
reportRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, limit: 10 }),
  validate({
    report: { required: true, min: 10 },
  }),
  reportController.addReport
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete report
reportRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  reportController.deleteReport
);

export default reportRoute;
