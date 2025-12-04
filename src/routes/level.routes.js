import { Hono } from "hono";
import * as levelController from "../controllers/level/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const levelRoute = new Hono();

/**
 * ======================
 * PUBLIC ROUTES
 * ======================
 */

// Get all levels
levelRoute.get("/", authMiddleware, levelController.getLevels);

// Get level by id
levelRoute.get("/:id", authMiddleware, levelController.getLevel);

/**
 * ======================
 * ADMIN / MANAGER ROUTES
 * ======================
 */

// Add a new level
levelRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validate({
    subjectId: { required: true, type: "number", min: 1 },
    levelName: { required: true, min: 3, max: 50 },
    paymentAmmount: { required: false, type: "number" },
  }),
  levelController.addLevel
);

// Update level
levelRoute.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  levelController.updateLevel
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete level
levelRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  levelController.deleteLevel
);

export default levelRoute;
