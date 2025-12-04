import { Hono } from "hono";
import * as paymentController from "../controllers/payment/index.js";
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

const paymentRoute = new Hono();

/**
 * ======================
 * MANAGER / ADMIN ROUTES
 * ======================
 */

// Get all payments
paymentRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  paymentController.getPayments
);

// Payment back to student
paymentRoute.put(
  "/back-to-student/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  paymentController.backToStudent
);

// Complete payment
paymentRoute.put(
  "/complete-payment/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  paymentController.completePayment
);

// Pending payments
paymentRoute.get(
  "/pending-payment",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  paymentController.pendingPayment
);

// Backed payments
paymentRoute.get(
  "/backed-payment",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  paymentController.backedPayment
);

// Completed payments (manager only)
paymentRoute.get(
  "/completed-payment",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  paymentController.completedPayment
);

/**
 * ======================
 * STUDENT ROUTES
 * ======================
 */

// Get my payment info
paymentRoute.get(
  "/my-payment-info",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  paymentController.myPaymentInfo
);

// Get payment by publicId (accessible to any authenticated user)
paymentRoute.get("/:publicId", authMiddleware, paymentController.getPayment);

// Add a new payment
paymentRoute.post(
  "/add",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, max: 10 }),
  validate({
    methodId: { required: true, pattern: /^[1-9][0-9]*$/ },
    transactionNo: { required: true, min: 3, max: 50 },
    payMonth: { required: true, min: 1, max: 4 },
  }),
  paymentController.addPayment
);

// Update payment
paymentRoute.put(
  "/update/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, max: 10 }),
  paymentController.updatePayment
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete payment
paymentRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  paymentController.deletePayment
);

export default paymentRoute;
