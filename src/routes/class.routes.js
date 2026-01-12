import { Hono } from "hono";
import * as ClassController from "../controllers/class/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { rateLimit } from "../middleware/rateLimit.js";

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STUDENT: "student",
};

const classRoute = new Hono();

classRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.getClasses
);

classRoute.get(
  "/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.getClass
);

classRoute.get(
  "/count",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.classCount
);

classRoute.put(
  "/lastpayment/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.updateLastPaymentDate
);

classRoute.put(
  "/learningstatus/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.learningStatusClass
);

classRoute.put(
  "/approve/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  ClassController.approveClass
);

classRoute.get(
  "/my-classes/",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  ClassController.myClass
);

classRoute.post(
  "/register",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, limit: 10 }),
  ClassController.addClass
);

classRoute.put(
  "/update/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  ClassController.updateClass
);

classRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  ClassController.deleteClass
);

export default classRoute;
