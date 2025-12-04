import { Hono } from "hono";
import * as UserController from "../controllers/user/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { verifyPhone } from "../middleware/verifyPhone.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validateMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STUDENT: "student",
};

const userRoute = new Hono();

/**
 * ======================
 * PUBLIC ROUTES
 * ======================
 */

// User registration
userRoute.post(
  "/register",
  validate({
    phone: { required: true, pattern: /^[0-9]{9,15}$/ },
    password: { required: true, min: 4, max: 15 },
  }),
  rateLimit({ windowMs: 60 * 1000, limit: 10 }),
  UserController.addUser
);

// User login
userRoute.post(
  "/login",
  validate({
    phone: { required: true, pattern: /^[0-9]{9,15}$/ },
    password: { required: true, min: 3, max: 30 },
  }),
  rateLimit({ windowMs: 60 * 1000, limit: 5 }),
  UserController.loginUser
);

// Forgot password
userRoute.post(
  "/forgot",
  validate({ phone: { required: true, pattern: /^[0-9]{9,15}$/ } }),
  rateLimit({ windowMs: 2 * 60 * 1000, limit: 10 }),
  UserController.forgotPassword
);

// Reset password
userRoute.post(
  "/reset-password",
  validate({
    phone: { required: true, pattern: /^[0-9]{9,15}$/ },
    code: { required: true, pattern: /^[0-9]{6}$/, min: 6, max: 6 },
  }),
  rateLimit({ windowMs: 10 * 60 * 1000, limit: 10 }),
  UserController.resetPassword
);

// Resend OTP routes
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

// Verify user phone
userRoute.post(
  "/verify",
  validate({
    phone: { required: true, pattern: /^[0-9]{9,15}$/ },
    code: { required: true, pattern: /^[0-9]{6}$/, min: 6, max: 6 },
  }),
  rateLimit({ windowMs: 5 * 60 * 1000, limit: 10 }),
  UserController.verifyUser
);

/**
 * ======================
 * AUTHENTICATED ROUTES
 * ======================
 */

// Get all users (admin/manager)
userRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  UserController.getUsers
);

// Get user by publicId
userRoute.get(
  "/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  UserController.getUser
);

// User profile
userRoute.get(
  "/me",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.STUDENT]),
  UserController.authorized
);

// Refresh token
userRoute.post(
  "/refresh",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER, ROLES.STUDENT]),
  UserController.refreshToken
);

// Change password
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

// Change password by manager for any user
userRoute.put(
  "/change-password/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  UserController.updateUser
);

// User activation (admin/manager)
userRoute.put(
  "/activation/:id",
  authMiddleware,
  roleMiddleware([ROLES.ADMIN, ROLES.MANAGER]),
  UserController.userActivation
);

// User status (manager-only)
userRoute.put(
  "/status/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  UserController.userStatus
);

// Delete user (manager-only)
userRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  UserController.deleteUser
);

/**
 * ======================
 * ADMIN-ONLY ROUTES
 * ======================
 */

// Add admin
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

// Get all admins
userRoute.get(
  "/admins/",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  UserController.getAdmins
);

// Get admin by id
userRoute.get(
  "/admin/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  UserController.getAdmin
);

/**
 * ======================
 * PROTECTED ROUTES
 * ======================
 */

userRoute.get("/dashboard/", authMiddleware, verifyPhone, (c) => {
  const user = c.get("user");
  return c.json({ message: `Welcome to your dashboard, ${user.publicId}!` });
});

export default userRoute;
