import { Hono } from "hono";
import * as ClassController from "../controllers/class/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { rateLimit } from "../middleware/rateLimit.js";

//  role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STUDENT: "student",
};

const classRoute = new Hono();

/**
 * ======================
 * ADMIN / MANAGER ROUTES
 * ======================
 */

// Get all classes
classRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.getClasses
);

// Get class by publicId
classRoute.get(
  "/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.getClass
);

// Get total class count
classRoute.get(
  "/count",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.classCount
);

// Update last payment date
classRoute.put(
  "/lastpayment/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.updateLastPaymentDate
);

// Update learning status
classRoute.put(
  "/learningstatus/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.learningStatusClass
);

/**
 * ======================
 * STUDENT ROUTES
 * ======================
 */

// Get my classes
classRoute.get(
  "/my-classes/",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  ClassController.myClass
);

// Register a new class
classRoute.post(
  "/register",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, limit: 10 }),
  ClassController.addClass
);

// Update class info
classRoute.put(
  "/update/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  ClassController.updateClass
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete class
classRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  ClassController.deleteClass
);

export default classRoute;
