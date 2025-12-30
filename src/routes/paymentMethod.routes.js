import { Hono } from "hono";
import * as paymentMethodController from "../controllers/paymentMethod/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const paymentMethodRoute = new Hono();
paymentMethodRoute.get(
  "/",
  // authMiddleware,
  paymentMethodController.getPaymentMethods
);

paymentMethodRoute.get(
  "/:id",
  authMiddleware,
  paymentMethodController.getPaymentMethod
);

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

paymentMethodRoute.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  paymentMethodController.updatePaymentMethod
);

paymentMethodRoute.patch(
  "/manage/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  paymentMethodController.managePaymentMethod
);

paymentMethodRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  paymentMethodController.deletePaymentMethod
);

export default paymentMethodRoute;
