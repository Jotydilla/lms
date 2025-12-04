import { Hono } from "hono";
import * as paymentMethodController from "../controllers/paymentMethod/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const paymentMethodRoute = new Hono();

/**
 * ======================
 * PUBLIC ROUTES
 * ======================
 */

// Get all payment methods
paymentMethodRoute.get(
  "/",
  authMiddleware,
  paymentMethodController.getPaymentMethods
);

// Get payment method by id
paymentMethodRoute.get(
  "/:id",
  authMiddleware,
  paymentMethodController.getPaymentMethod
);

/**
 * ======================
 * ADMIN / MANAGER ROUTES
 * ======================
 */

// Add a new payment method
paymentMethodRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  validate({
    methodName: { required: true, type: "string", min: 3 },
    holderName: { required: true, type: "string", min: 3 },
  }),
  paymentMethodController.addPaymentMethod
);

// Update payment method
paymentMethodRoute.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  paymentMethodController.updatePaymentMethod
);

// Manage payment method (e.g., enable/disable)
paymentMethodRoute.patch(
  "/manage/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  paymentMethodController.managePaymentMethod
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete payment method
paymentMethodRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  paymentMethodController.deletePaymentMethod
);

export default paymentMethodRoute;
