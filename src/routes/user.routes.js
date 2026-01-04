import { Hono } from "hono";
import * as UserController from "../controllers/user/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyPhone } from "../middleware/verifyPhone.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validateMiddleware.js";

const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STUDENT: "student",
};

const userRoute = new Hono();

userRoute.post(
  "/register",
  validate({
    phone: { required: true, pattern: /^[0-9]{9,15}$/ },
    password: { required: true, min: 2, max: 15 },
  }),
  rateLimit({ windowMs: 60 * 1000, limit: 50 }),
  UserController.addUser
);

userRoute.post(
  "/login",
  validate({
    phone: { required: true, pattern: /^[0-9]{9,15}$/ },
    password: { required: true, min: 3, max: 30 },
  }),
  rateLimit({ windowMs: 60 * 1000, limit: 15 }),
  UserController.loginUser
);

userRoute.post(
  "/forgot",
  validate({ phone: { required: true, pattern: /^[0-9]{9,15}$/ } }),
  rateLimit({ windowMs: 10 * 60 * 1000, limit: 10 }),
  UserController.forgotPassword
);

userRoute.post(
  "/reset-password",
  validate({
    phone: { required: true, pattern: /^[0-9]{9,15}$/ },
    code: { required: true, pattern: /^[0-9]{6}$/, min: 6, max: 6 },
  }),
  rateLimit({ windowMs: 10 * 60 * 1000, limit: 10 }),
  UserController.resetPassword
);

userRoute.post(
  "/resend-otp-password",
  validate({ phone: { required: true, pattern: /^[0-9]{9,15}$/ } }),
  rateLimit({ windowMs: 10 * 60 * 1000, limit: 10 }),
  UserController.resendOTPPassword
);

userRoute.post(
  "/resend-otp-activation",
  validate({ phone: { required: true, pattern: /^[0-9]{9,15}$/ } }),
  rateLimit({ windowMs: 10 * 60 * 1000, limit: 10 }),
  UserController.resendOTPActivation
);

userRoute.post(
  "/verify",
  validate({
    phone: { required: true, pattern: /^[0-9]{9,15}$/ },
    code: { required: true, pattern: /^[0-9]{6}$/, min: 6, max: 6 },
  }),
  rateLimit({ windowMs: 5 * 60 * 1000, limit: 10 }),
  UserController.verifyUser
);

userRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  UserController.getUsers
);

userRoute.get(
  "/:publicId",
  // authMiddleware,
  // roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.STUDENT]),
  UserController.getUser
);

userRoute.post("/otp-verify/:publicId", UserController.verifyOTP);

userRoute.get(
  "/me",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.STUDENT]),
  UserController.authorized
);

userRoute.post(
  "/refresh",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.STUDENT]),
  UserController.refreshToken
);
userRoute.post(
  "/logout",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.STUDENT]),
  UserController.logoutUser
);

userRoute.put(
  "/change-password",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.STUDENT]),
  validate({
    oldPassword: { required: true, min: 3, max: 15 },
    newPassword: { required: true, min: 3, max: 15 },
    comfirmPassword: { required: true, min: 3, max: 15 },
  }),
  rateLimit({ windowMs: 60 * 1000, limit: 5 }),
  UserController.changePassword
);

userRoute.put(
  "/change-password/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  UserController.updateUser
);

userRoute.put(
  "/activation/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  UserController.userActivation
);

userRoute.put(
  "/status/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  UserController.userStatus
);

userRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  UserController.deleteUser
);

userRoute.post(
  "/admin",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  validate({
    phone: { required: true, pattern: /^[0-9]{9,15}$/ },
    password: { required: true, min: 4, max: 15 },
  }),
  UserController.addAdmin
);

userRoute.get(
  "/admins/",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  UserController.getAdmins
);

userRoute.get(
  "/admin/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  UserController.getAdmin
);

userRoute.get("/dashboard/", authMiddleware, verifyPhone, (c) => {
  const user = c.get("user");
  return c.json({ message: `Welcome to your dashboard, ${user.publicId}!` });
});

export default userRoute;
