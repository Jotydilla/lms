import { Hono } from "hono";

import classRoute from "./class.routes.js";
import levelRoute from "./level.routes.js";
import paymentRoute from "./payment.routes.js";
import reportRoute from "./report.routes.js";
import studentRoute from "./student.routes.js";
import subjectRoute from "./subject.routes.js";
import systemRoute from "./systeminfo.routes.js";
import userRoute from "./user.routes.js";
import paymentMethodRoute from "./paymentMethod.routes.js";
import authRouter from "./auth.route.js";
import courseRoute from "./course.route.js";
import examRoute from "./exam.route.js";
import examQuestionRoute from "./examquestion.route.js";
import studentExamAnswerRoute from "./studentexamanswer.js";
import commentRoute from "./courseComment.route.js";
import courseVideoRoute from "./courseVideo.route.js";
import instructorRoute from "./instructors.route.js";
import publicCourseRoute from "./publicCourse.route.js";
import publicCourseTopicRoute from "./publicTopicCourseTopic.route.js";

const routes = new Hono();

routes.route("/classes", classRoute);
routes.route("/levels", levelRoute);
routes.route("/payments", paymentRoute);
routes.route("/reports", reportRoute);
routes.route("/students", studentRoute);
routes.route("/subjects", subjectRoute);
routes.route("/systems", systemRoute);
routes.route("/users", userRoute);
routes.route("/payment-methods", paymentMethodRoute);
routes.route("/courses", courseRoute);
routes.route("/course-videos", courseVideoRoute);
routes.route("/exams", examRoute);
routes.route("/exam-questions", examQuestionRoute);
routes.route("/exam-answers", studentExamAnswerRoute);
routes.route("/comments", commentRoute);
routes.route("/instructors", instructorRoute);
routes.route("/public-courses", publicCourseRoute);
routes.route("/public-course-topics", publicCourseTopicRoute);

routes.route("/dashboard", authRouter);

export default routes;
