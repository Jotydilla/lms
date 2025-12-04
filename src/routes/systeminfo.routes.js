import { Hono } from "hono";
import * as systeminfoController from "../controllers/systeminfo/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const systemRoute = new Hono();

/**
 * ======================
 * PUBLIC ROUTES
 * ======================
 */

// Get all system info
systemRoute.get("/", systeminfoController.getSystemsinfo);

// Get system info by id
systemRoute.get("/:id", systeminfoController.getSysteminfo);

/**
 * ======================
 * ADMIN / MANAGER ROUTES
 * ======================
 */

// Add new system info
systemRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validate({
    systemPhone: { required: true, pattern: /^[0-9]{9,15}$/ },
    systemEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  }),
  systeminfoController.addSysteminfo
);

// Update system info
systemRoute.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validate({
    systemPhone: { required: true, pattern: /^[0-9]{9,15}$/ },
    systemEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  }),
  systeminfoController.updateSysteminfo
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete system info
systemRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  systeminfoController.deleteSysteminfo
);

export default systemRoute;
