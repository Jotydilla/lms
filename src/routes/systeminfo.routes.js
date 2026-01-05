import { Hono } from "hono";
import * as systeminfoController from "../controllers/systeminfo/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
};

const systemRoute = new Hono();

systemRoute.get("/", systeminfoController.getSystemsinfo);

systemRoute.get("/:id", systeminfoController.getSysteminfo);

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

systemRoute.delete(
  "/delete/:id",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  systeminfoController.deleteSysteminfo
);

export default systemRoute;
