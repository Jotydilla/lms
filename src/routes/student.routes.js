import { Hono } from "hono";
import * as studentController from "../controllers/student/index.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { rateLimit } from "../middleware/rateLimit.js";
import { validate } from "../middleware/validateMiddleware.js";

// Role constants
const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  STUDENT: "student",
};

const studentRoute = new Hono();

/**
 * ======================
 * MANAGER / ADMIN ROUTES
 * ======================
 */

// Get all students
studentRoute.get(
  "/",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  studentController.getStudents
);

// Get student by publicId
studentRoute.get(
  "/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  studentController.getStudent
);

// Get student count
studentRoute.get(
  "/count",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER, ROLES.ADMIN]),
  studentController.studentCount
);

/**
 * ======================
 * STUDENT ROUTES
 * ======================
 */

// Register student
studentRoute.post(
  "/register",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, max: 10 }),
  validate({
    firstName: { required: true, min: 3, max: 20 },
    middleName: { required: true, min: 3, max: 20 },
    lastName: { required: true, min: 3, max: 20 },
    age: { required: true, pattern: /^[1-9][0-9]*$/ },
    gender: { required: true, pattern: /^(male|female)$/ },
    educationLevel: { required: true, min: 2 },
    address: { required: true, min: 1 },
    churchName: { required: true, min: 1 },
  }),
  studentController.addStudent
);

// Update student info
studentRoute.put(
  "/update",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, max: 10 }),
  validate({
    firstName: { required: true, min: 3, max: 20 },
    middleName: { required: true, min: 3, max: 20 },
    lastName: { required: true, min: 3, max: 20 },
    age: { required: true, pattern: /^[1-9][0-9]*$/ },
    gender: { required: true, pattern: /^(male|female)$/ },
    educationLevel: { required: true, min: 2 },
    address: { required: true, min: 2 },
    churchName: { required: true, min: 2 },
  }),
  studentController.updateStudent
);

// Update student photo
studentRoute.put(
  "/change-photo",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  rateLimit({ windowMs: 60 * 1000, max: 5 }),
  studentController.updatePhoto
);

// Get student profile
studentRoute.get(
  "/me/profile",
  authMiddleware,
  roleMiddleware([ROLES.STUDENT]),
  studentController.profile
);

/**
 * ======================
 * MANAGER-ONLY ROUTES
 * ======================
 */

// Delete student
studentRoute.delete(
  "/delete/:publicId",
  authMiddleware,
  roleMiddleware([ROLES.MANAGER]),
  studentController.deleteStudent
);

export default studentRoute;
