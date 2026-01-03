-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 03, 2026 at 09:27 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `school`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL,
  `public_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `level_id` int(11) DEFAULT NULL,
  `course_title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `course_order` int(11) NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`course_id`, `public_id`, `level_id`, `course_title`, `description`, `course_order`, `thumbnail`, `createdAt`, `updatedAt`) VALUES
(1, 'd8494e4e-0420-4a0d-bb0d-4988903867dc', 1, 'Deploma Lesson one and two ', 'this course is very nice and holly sprit', 2, 'e077bba9-5b78-4518-b7c8-2def78ee78e2.jpg', '2025-12-02 17:18:11', '2025-12-02 17:25:17');

-- --------------------------------------------------------

--
-- Table structure for table `course_comment`
--

CREATE TABLE `course_comment` (
  `comment_id` int(11) NOT NULL,
  `public_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `courseId` int(11) NOT NULL,
  `comment` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `course_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_comment`
--

INSERT INTO `course_comment` (`comment_id`, `public_id`, `user_id`, `courseId`, `comment`, `createdAt`, `updatedAt`, `course_id`) VALUES
(1, 'f8ae27c9-6e11-4fa1-ab2f-9cc83b96f074', 3, 1, 'nice this course is very best', '2025-12-02 17:57:08', '2025-12-02 17:57:08', NULL),
(2, 'a8d861d4-0a2e-483a-9c60-199a9d9e89c8', 4, 1, 'thak you , god bless ypu!!', '2025-12-02 17:58:41', '2025-12-02 17:58:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `course_videos`
--

CREATE TABLE `course_videos` (
  `course_video_id` int(11) NOT NULL,
  `public_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `video_title` varchar(255) NOT NULL,
  `video_url` varchar(255) NOT NULL,
  `video_duration` int(11) DEFAULT NULL,
  `video_order` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course_videos`
--

INSERT INTO `course_videos` (`course_video_id`, `public_id`, `course_id`, `video_title`, `video_url`, `video_duration`, `video_order`, `createdAt`, `updatedAt`) VALUES
(1, 'beaf7071-4285-425b-97da-72fb00609930', 1, 'lesson one first video', '/courses/videos/b83fb24e-231b-4c97-b297-a6ef6e00ed44.mp4', 1200, 1, '2025-12-02 17:39:36', '2025-12-02 17:47:58');

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `exam_id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `exam_title` varchar(255) NOT NULL,
  `time_limit` int(11) NOT NULL,
  `total_marks` int(11) DEFAULT 100,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`exam_id`, `course_id`, `exam_title`, `time_limit`, `total_marks`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'Lesson one exam', 60, 50, '2025-12-02 18:15:37', '2025-12-02 18:15:37');

-- --------------------------------------------------------

--
-- Table structure for table `exam_questions`
--

CREATE TABLE `exam_questions` (
  `question_id` int(11) NOT NULL,
  `exam_id` int(11) DEFAULT NULL,
  `question_text` text NOT NULL,
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) DEFAULT NULL,
  `option_d` varchar(255) DEFAULT NULL,
  `correct_option` varchar(255) NOT NULL,
  `marks` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_questions`
--

INSERT INTO `exam_questions` (`question_id`, `exam_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `marks`) VALUES
(1, 1, 'what is human biengs', 'nice to meet you', 'true', 'false', 'nice', 'true', 3);

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `level_id` int(11) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `level_name` varchar(255) NOT NULL,
  `payment_ammount` float NOT NULL,
  `week_number` int(11) DEFAULT 7,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `levels`
--

INSERT INTO `levels` (`level_id`, `subject_id`, `level_name`, `payment_ammount`, `week_number`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'deploma', 2500, 1, '2025-11-28 09:59:50', '2025-11-28 09:59:50'),
(2, 1, 'degree', 2800, 1, '2025-11-28 10:00:10', '2025-11-28 10:00:10'),
(3, 1, 'master', 3000, 1, '2025-11-28 10:00:44', '2025-11-28 10:00:44'),
(4, 2, 'certificate', 1000, 1, '2025-11-28 10:00:55', '2025-11-28 10:00:55');

-- --------------------------------------------------------

--
-- Table structure for table `payment_method`
--

CREATE TABLE `payment_method` (
  `method_id` int(11) NOT NULL,
  `method_name` varchar(255) NOT NULL,
  `holder_name` varchar(255) NOT NULL,
  `account_number` varchar(255) NOT NULL,
  `account_code` varchar(20) NOT NULL,
  `account_status` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_method`
--

INSERT INTO `payment_method` (`method_id`, `method_name`, `holder_name`, `account_number`, `account_code`, `account_status`) VALUES
(1, 'CBE', 'Theology School', '1000693122323', 'cbe', 0),
(2, 'Telebirr', 'Theology School', '0985310036', 'telebirr', 0),
(3, 'Awash Bank', 'Theology School', '30912312323200', 'awash', 0),
(4, 'Bank of Abyssinia', 'Green Accedemy school', '81241248126412', 'abyssinia', 0);

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `report_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `report` text NOT NULL,
  `report_status` tinyint(4) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`report_id`, `user_id`, `report`, `report_status`, `createdAt`, `updatedAt`) VALUES
(1, 3, 'nice systems and ...', 0, '2025-12-03 07:26:28', '2025-12-03 07:26:28');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `student_id` int(11) NOT NULL,
  `public_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `aducation_level` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `photo` varchar(255) NOT NULL,
  `church_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`student_id`, `public_id`, `user_id`, `first_name`, `middle_name`, `last_name`, `age`, `gender`, `aducation_level`, `address`, `photo`, `church_name`, `createdAt`, `updatedAt`) VALUES
(1, '25aadcdf-a67c-40ca-9523-bace190d13b0', 3, 'Jote', 'Dilla', 'Dufera', 21, 'male', 'Deploma', 'Adama', '12949761-5819-4fa1-ab4b-41a462895a1f.png', 'Makane Yesus', '2025-11-28 10:05:41', '2025-11-28 10:05:41'),
(2, 'ae4b7875-718f-49c9-b715-c1980062ea4a', 4, 'Sifan', 'Tola', 'Malke', 31, 'female', 'degree', 'Addis Ababa', '022e9dfc-1c31-4668-b89c-82d9e4595e51.jpg', 'Kale yiwot', '2025-11-28 10:10:07', '2025-11-28 10:10:07');

-- --------------------------------------------------------

--
-- Table structure for table `student_class`
--

CREATE TABLE `student_class` (
  `class_id` int(11) NOT NULL,
  `public_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `level_id` int(11) DEFAULT NULL,
  `criteria_file` varchar(255) NOT NULL,
  `join_date` date NOT NULL,
  `last_payment_date` date NOT NULL,
  `paid_month` int(11) NOT NULL DEFAULT 0,
  `payment_status` int(11) NOT NULL DEFAULT 0,
  `finished_course` int(11) NOT NULL DEFAULT 0,
  `learning_status` enum('new','current','break','finished') DEFAULT 'new',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_class`
--

INSERT INTO `student_class` (`class_id`, `public_id`, `student_id`, `level_id`, `criteria_file`, `join_date`, `last_payment_date`, `paid_month`, `payment_status`, `finished_course`, `learning_status`, `createdAt`, `updatedAt`) VALUES
(1, 'e360cbdc-45e1-4aad-b99c-39ed750b881a', 1, 2, '34bcdb6a-cb72-4422-8a7e-95aad6897d47.png', '2025-11-28', '2025-11-28', 0, 1, 0, 'new', '2025-11-28 10:30:59', '2025-11-30 13:26:14'),
(2, 'f71aebd0-2ae3-4aa8-9e49-c3a8fcd7eae1', 2, 1, 'a4ab2be1-6087-4ada-a002-2bbaef06c9bb.jpg', '2025-11-28', '2025-11-28', 0, 0, 0, 'new', '2025-11-28 10:31:35', '2025-11-28 10:31:35');

-- --------------------------------------------------------

--
-- Table structure for table `student_exam_answers`
--

CREATE TABLE `student_exam_answers` (
  `exam_answer_id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `exam_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `student_answer` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_payment`
--

CREATE TABLE `student_payment` (
  `payment_id` int(11) NOT NULL,
  `public_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `method_id` int(11) DEFAULT NULL,
  `transaction_no` varchar(255) NOT NULL,
  `pay_month` int(11) NOT NULL DEFAULT 1,
  `receipt` varchar(255) NOT NULL,
  `payment_date` datetime NOT NULL,
  `payment_status` tinyint(4) DEFAULT 0,
  `back_to_student` tinyint(4) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_payment`
--

INSERT INTO `student_payment` (`payment_id`, `public_id`, `class_id`, `method_id`, `transaction_no`, `pay_month`, `receipt`, `payment_date`, `payment_status`, `back_to_student`, `createdAt`, `updatedAt`) VALUES
(1, 'cc15badf-755a-4e92-91a4-b9cdcf9e566d', 1, 1, 'FTE123124DDN', 2, '21308a85-59be-47b6-843f-9344ae5c9a77.png', '2025-11-30 13:26:14', 0, 0, '2025-11-30 13:26:14', '2025-11-30 13:26:14');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_name`, `createdAt`, `updatedAt`) VALUES
(1, 'Theology', '2025-11-28 09:53:42', '2025-12-04 09:17:34'),
(2, 'Bible Study', '2025-11-28 09:53:54', '2025-12-04 09:17:46'),
(3, 'Church History', '2025-11-30 13:18:34', '2025-12-04 09:17:57');

-- --------------------------------------------------------

--
-- Table structure for table `system_information`
--

CREATE TABLE `system_information` (
  `system_id` int(11) NOT NULL,
  `system_phone` varchar(15) NOT NULL,
  `system_email` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `system_information`
--

INSERT INTO `system_information` (`system_id`, `system_phone`, `system_email`, `createdAt`, `updatedAt`) VALUES
(1, '0985310036', 'greendabbus@gmail.com', '2025-12-03 07:09:34', '2025-12-03 07:09:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `public_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('admin','student','manager','teacher') NOT NULL DEFAULT 'student',
  `status` enum('active','inactive','banned') DEFAULT 'active',
  `is_verified` tinyint(1) DEFAULT 0,
  `last_login` datetime DEFAULT NULL,
  `verification_code` varchar(10) DEFAULT NULL,
  `verification_expires` datetime(6) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `public_id`, `phone`, `password`, `user_type`, `status`, `is_verified`, `last_login`, `verification_code`, `verification_expires`, `createdAt`, `updatedAt`) VALUES
(1, 'e72b56c5-4527-4af9-b740-d161bf92c17d', '0985310036', '$2b$10$fhYtHTQB8NeI75tvEzaVhuR23onYsPVclE/Mbgfag3610n9arx0qG', 'manager', 'active', 1, '2025-11-28 09:40:36', NULL, NULL, '2025-11-28 09:40:36', '2025-11-28 09:45:58'),
(2, 'f10e2cc3-a2e5-47e3-a1a2-22448649cc48', '0985310037', '$2b$10$dKYptO9Cscm0cm6IRDn2s.w/p9V6nde.nKYJo5bYWe1szkp175OOS', 'admin', 'active', 1, '2025-11-28 09:40:43', NULL, NULL, '2025-11-28 09:40:43', '2025-11-28 09:47:35'),
(3, '1dd7bdc0-cec8-45ac-a68d-8685f3e13cd5', '0985310038', '$2b$10$48lFbYdK9edyTcZU1ZLlqOrSPTT1py/RY78GccMEWnMLOvpk/NIUG', 'student', 'active', 1, '2025-11-28 09:41:43', NULL, NULL, '2025-11-28 09:41:43', '2025-11-28 09:48:07'),
(4, 'd030b4f9-a53c-4c94-a7fa-677bf1823072', '0985310039', '$2b$10$GrEnZy0v5perFkzhETTH/etrVV.MKWZZxW266m.gaMmPKPG911XGm', 'student', 'active', 1, '2025-11-28 09:41:47', NULL, NULL, '2025-11-28 09:41:47', '2025-11-28 10:08:15');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `session_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `refresh_token` text NOT NULL,
  `fingerprint` varchar(256) NOT NULL,
  `device_id` varchar(255) DEFAULT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` varchar(255) NOT NULL,
  `last_used_at` datetime DEFAULT NULL,
  `expires_at` datetime NOT NULL,
  `is_revoked` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_sessions`
--

INSERT INTO `user_sessions` (`session_id`, `user_id`, `refresh_token`, `fingerprint`, `device_id`, `device_name`, `ip_address`, `user_agent`, `last_used_at`, `expires_at`, `is_revoked`, `createdAt`, `updatedAt`) VALUES
('26772cdf-b725-4d12-a6be-41881ae0319d', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NzA5MDMwNSwiZXhwIjoxNzY5NjgyMzA1fQ.Lv2G_Ob4YFvZvRYNymi5dhRYmY9-AUvB9LMUstp6YlM', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-30 10:25:05', '2026-01-29 10:25:05', 1, '2025-12-30 10:25:05', '2026-01-01 06:50:47'),
('27379a32-deb4-417a-a7b6-0ddc7ac6d809', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NzAxNDA2NywiZXhwIjoxNzY5NjA2MDY3fQ.PfTG74MZx_LZIq5YjWkGRI3L7Z_DOUyA1ylACIexQqs', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-29 13:14:27', '2026-01-28 13:14:27', 1, '2025-12-29 13:14:27', '2025-12-30 10:33:49'),
('331de515-3daf-4fc1-8184-de05a2cf0307', 'f10e2cc3-a2e5-47e3-a1a2-22448649cc48', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYxMGUyY2MzLWEyZTUtNDdlMy1hMWEyLTIyNDQ4NjQ5Y2M0OCIsImlhdCI6MTc2NzA5MDg5MCwiZXhwIjoxNzY5NjgyODkwfQ.kJAyDyI9bI5G6IcH0CnnVlUcFpsIMnIDpu_omFT_fCc', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-30 10:34:50', '2026-01-29 10:34:50', 0, '2025-12-30 10:34:50', '2025-12-30 10:34:50'),
('3c543842-e464-424c-9d28-174fce736fa8', 'd030b4f9-a53c-4c94-a7fa-677bf1823072', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwMzBiNGY5LWE1M2MtNGM5NC1hN2ZhLTY3N2JmMTgyMzA3MiIsImlhdCI6MTc2NDg2NTYyNiwiZXhwIjoxNzY3NDU3NjI2fQ.GLrFDEItekXwqyFYZB-mRDJ8KrhBKOqBzfL9SUsIPW8', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 16:27:06', '2026-01-03 16:27:06', 0, '2025-12-04 16:27:06', '2025-12-04 16:27:06'),
('3d149368-c777-4044-84a0-1fa0ad8f715d', 'd030b4f9-a53c-4c94-a7fa-677bf1823072', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwMzBiNGY5LWE1M2MtNGM5NC1hN2ZhLTY3N2JmMTgyMzA3MiIsImlhdCI6MTc2NDUwNDQyMywiZXhwIjoxNzY3MDk2NDIzfQ.WmsMxhLud58JfKKdt3EftZsUASDPHeV6g6fxZ1uHY0w', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-30 12:07:03', '2025-12-30 12:07:03', 1, '2025-11-30 12:07:03', '2025-12-04 09:15:40'),
('5c5c6281-4997-442c-bb21-03041f27f8ff', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NzAxNTcwMCwiZXhwIjoxNzY5NjA3NzAwfQ.yacRcv2dfkWynkHOQwhxY56rHv2qIi7765Owkd4hWrA', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-29 13:41:40', '2026-01-28 13:41:40', 1, '2025-12-29 13:41:40', '2025-12-30 10:37:23'),
('6490acd8-b390-4533-9251-6ec347a522c0', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NDY1NjI1MywiZXhwIjoxNzY3MjQ4MjUzfQ.XJtsQJu6jq3HAVKnaBS5LD0bNLuzlBlu_1iP86HLN8U', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-02 06:17:33', '2026-01-01 06:17:33', 1, '2025-12-02 06:17:33', '2025-12-04 09:16:51'),
('68997402-0996-4e01-be54-173b9e5a617e', 'f10e2cc3-a2e5-47e3-a1a2-22448649cc48', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYxMGUyY2MzLWEyZTUtNDdlMy1hMWEyLTIyNDQ4NjQ5Y2M0OCIsImlhdCI6MTc2NzA5MTA1MywiZXhwIjoxNzY5NjgzMDUzfQ.8xM0sL_qBICNoJuWngKUuT2iE43d-5PIT9gtyLF0PZo', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-30 10:37:33', '2026-01-29 10:37:33', 0, '2025-12-30 10:37:33', '2025-12-30 10:37:33'),
('6aca1d42-5800-44e7-a28f-dba66c1ea944', '1dd7bdc0-cec8-45ac-a68d-8685f3e13cd5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkZDdiZGMwLWNlYzgtNDVhYy1hNjhkLTg2ODVmM2UxM2NkNSIsImlhdCI6MTc2NDMyMzMxNywiZXhwIjoxNzY2OTE1MzE3fQ.LVFJvKYdzK1G_yrRuUf0yN_jPH767ppPuMhpy66OSOA', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-28 09:48:37', '2025-12-28 09:48:37', 1, '2025-11-28 09:48:37', '2025-12-02 06:20:56'),
('729af0e2-f8ac-45b8-9e04-2e8d1dad7bfa', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NzI1MDI1OSwiZXhwIjoxNzY5ODQyMjU5fQ.59UiDys-BdxzMfsLvkjnFX6FAJmbphzKTwBYqrLCc10', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2026-01-01 06:50:59', '2026-01-31 06:50:59', 0, '2026-01-01 06:50:59', '2026-01-01 06:50:59'),
('7849dd34-c435-4250-88d0-a7d88fb4fb49', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NzI1MDI0NywiZXhwIjoxNzY5ODQyMjQ3fQ.9R-R5hvTfWLyxVlnYDW406cq92YnQWeaeO90vTajw3k', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2026-01-01 06:50:47', '2026-01-31 06:50:47', 0, '2026-01-01 06:50:47', '2026-01-01 06:50:47'),
('7b7488ab-f02e-432e-a58f-d63f66a51370', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NzA5MTA0MywiZXhwIjoxNzY5NjgzMDQzfQ.nQjm48piT1fqtp8E2IzP9XiSi-ZnM27beMnrbyURTgk', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-30 10:37:23', '2026-01-29 10:37:23', 0, '2025-12-30 10:37:23', '2025-12-30 10:37:23'),
('8a945f9a-410c-4768-9a19-d5b37e4720e2', 'f10e2cc3-a2e5-47e3-a1a2-22448649cc48', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYxMGUyY2MzLWEyZTUtNDdlMy1hMWEyLTIyNDQ4NjQ5Y2M0OCIsImlhdCI6MTc2NDgzOTgxNiwiZXhwIjoxNzY3NDMxODE2fQ.oA0niM6toNHMEEL-MtbRMYHGt77YxMwTm2aErxQares', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 09:16:56', '2026-01-03 09:16:56', 0, '2025-12-04 09:16:56', '2025-12-04 09:16:56'),
('8ca21389-cb3f-4af8-b68f-e7ad4f3d8632', '1dd7bdc0-cec8-45ac-a68d-8685f3e13cd5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkZDdiZGMwLWNlYzgtNDVhYy1hNjhkLTg2ODVmM2UxM2NkNSIsImlhdCI6MTc2NDMyNDY5MiwiZXhwIjoxNzY2OTE2NjkyfQ.RyPee5g26Zd6oZgTaO0UEEcDgUCqpD39um8xOTe5Z5Y', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-28 10:11:32', '2025-12-28 10:11:32', 0, '2025-11-28 10:11:32', '2025-11-28 10:11:32'),
('9f163bfb-8340-43ac-ae48-750d277d5c54', '1dd7bdc0-cec8-45ac-a68d-8685f3e13cd5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkZDdiZGMwLWNlYzgtNDVhYy1hNjhkLTg2ODVmM2UxM2NkNSIsImlhdCI6MTc2NDUwNDM4NCwiZXhwIjoxNzY3MDk2Mzg0fQ.sstF3ulsGqmJHsHAdXEdyXkGGJW0rdm6dAbcVwszp10', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-30 12:06:24', '2025-12-30 12:06:24', 0, '2025-11-30 12:06:24', '2025-11-30 12:06:24'),
('a0fb075a-0081-4ff8-9a56-f22b6974d57f', 'd030b4f9-a53c-4c94-a7fa-677bf1823072', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwMzBiNGY5LWE1M2MtNGM5NC1hN2ZhLTY3N2JmMTgyMzA3MiIsImlhdCI6MTc2NDY5NTY4MiwiZXhwIjoxNzY3Mjg3NjgyfQ.3Cwht9O34d9KzZia1FuT-Tjfb_1OIuQPvvFldBlorEM', '6fe7644a5835b3257edc76662771ffa183ac5aff8bb4c34ac993fb6a62cdf171', '', '', '', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-02 17:14:42', '2026-01-01 17:14:42', 1, '2025-12-02 17:14:42', '2025-12-04 14:39:54'),
('a14cc50a-b84b-419d-99b9-6a1ff3954dc4', 'f10e2cc3-a2e5-47e3-a1a2-22448649cc48', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYxMGUyY2MzLWEyZTUtNDdlMy1hMWEyLTIyNDQ4NjQ5Y2M0OCIsImlhdCI6MTc2NDUwNDM4OCwiZXhwIjoxNzY3MDk2Mzg4fQ.ZJP4dxxj4HAPij0_zc49a_yuV8RY4_635Byx0C-XhPk', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-30 12:06:28', '2025-12-30 12:06:28', 1, '2025-11-30 12:06:28', '2025-12-30 10:34:50'),
('b15e297c-16f0-4674-ae62-a14ce309754e', 'd030b4f9-a53c-4c94-a7fa-677bf1823072', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwMzBiNGY5LWE1M2MtNGM5NC1hN2ZhLTY3N2JmMTgyMzA3MiIsImlhdCI6MTc2NDgzOTc0MCwiZXhwIjoxNzY3NDMxNzQwfQ.BhB6XhGU2zt_KcGIv05kEXYbqV0kuEKrYsQTqpGCXy8', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 09:15:41', '2026-01-03 09:15:41', 1, '2025-12-04 09:15:41', '2025-12-04 16:27:06'),
('b894287d-d4ba-44bb-bc60-b508a60aabef', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NDUwNDQxOSwiZXhwIjoxNzY3MDk2NDE5fQ.7wLT_uduUa84WkcNeubzxzV4fcnSfD7ha0BLfMbbq5s', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-30 12:06:59', '2025-12-30 12:06:59', 1, '2025-11-30 12:06:59', '2025-12-02 17:50:04'),
('badf4d6a-aef7-4213-bd54-cdb585cc5521', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NDY5NzgwNCwiZXhwIjoxNzY3Mjg5ODA0fQ.uUHtf09BCqZPnx2hEQ5qZn7a6lUkOcwxp-DcXllKWb8', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-02 17:50:04', '2026-01-01 17:50:04', 1, '2025-12-02 17:50:04', '2025-12-29 13:14:27'),
('bce7bc44-a164-4b74-b84b-bf68f0e0ec65', 'd030b4f9-a53c-4c94-a7fa-677bf1823072', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwMzBiNGY5LWE1M2MtNGM5NC1hN2ZhLTY3N2JmMTgyMzA3MiIsImlhdCI6MTc2NDg1OTE5MywiZXhwIjoxNzY3NDUxMTkzfQ.msDjaaqAMDFnN_btBITOYnVIG78ePrgC0QVLLeC8lx8', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 14:39:53', '2026-01-03 14:39:53', 0, '2025-12-04 14:39:53', '2025-12-04 14:39:53'),
('c7172c12-2db7-442c-ac04-efccec7018a6', 'd030b4f9-a53c-4c94-a7fa-677bf1823072', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwMzBiNGY5LWE1M2MtNGM5NC1hN2ZhLTY3N2JmMTgyMzA3MiIsImlhdCI6MTc2NDg1OTE5NCwiZXhwIjoxNzY3NDUxMTk0fQ.HrkKsVlZ5hu-K9zvB617wD-ldTP408KAVcQmO2xUL4A', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 14:39:54', '2026-01-03 14:39:54', 0, '2025-12-04 14:39:54', '2025-12-04 14:39:54'),
('c8a1011d-0fec-4086-972f-5dc2b3430351', 'd030b4f9-a53c-4c94-a7fa-677bf1823072', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwMzBiNGY5LWE1M2MtNGM5NC1hN2ZhLTY3N2JmMTgyMzA3MiIsImlhdCI6MTc2NDY1NjQ4OCwiZXhwIjoxNzY3MjQ4NDg4fQ.QQ_qrf7_QuYw9zAkBYsxUJ1tlT0Ku1qvoPBQfOeygek', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-02 06:21:28', '2026-01-01 06:21:28', 1, '2025-12-02 06:21:28', '2025-12-04 14:39:53'),
('ce689e8b-1021-4dd6-973a-09d6eef7a8b5', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NDgzOTgxMSwiZXhwIjoxNzY3NDMxODExfQ.bd55zErvyIq35z3AntFJX6RpBP6MgnxX4WrTcPz_990', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 09:16:51', '2026-01-03 09:16:51', 1, '2025-12-04 09:16:51', '2025-12-29 13:41:40'),
('dc5bc9e9-b437-4275-8ef8-b30987b7aa14', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NzAxNDAxNiwiZXhwIjoxNzY5NjA2MDE2fQ.4W-Uix5rLy-BYOBt63ilpelaaBeRBFeqzZYY0pv-ano', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-29 13:13:36', '2026-01-28 13:13:36', 1, '2025-12-29 13:13:36', '2025-12-30 10:25:05'),
('ddb24888-fdef-4a69-be28-fcaf1cdca84b', 'd030b4f9-a53c-4c94-a7fa-677bf1823072', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQwMzBiNGY5LWE1M2MtNGM5NC1hN2ZhLTY3N2JmMTgyMzA3MiIsImlhdCI6MTc2NDMyNDU4NywiZXhwIjoxNzY2OTE2NTg3fQ.UTX8ErAEDygjnFH0Nv-5_LR_xkxe-82GDMx8X7pPcnw', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-28 10:09:47', '2025-12-28 10:09:47', 1, '2025-11-28 10:09:47', '2025-12-02 17:14:42'),
('e3c4acc4-74b7-4bdb-8cd5-1fe96ac456f2', '1dd7bdc0-cec8-45ac-a68d-8685f3e13cd5', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkZDdiZGMwLWNlYzgtNDVhYy1hNjhkLTg2ODVmM2UxM2NkNSIsImlhdCI6MTc2NDY1NjQ1NiwiZXhwIjoxNzY3MjQ4NDU2fQ.SuFOcZl-R_Ccrvd5uEVh2t0qYwAIJoh_ZgumU15PK2o', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-02 06:20:56', '2026-01-01 06:20:56', 0, '2025-12-02 06:20:56', '2025-12-02 06:20:56'),
('e421b997-4fda-4e3b-ad1e-539b477c62b8', 'f10e2cc3-a2e5-47e3-a1a2-22448649cc48', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYxMGUyY2MzLWEyZTUtNDdlMy1hMWEyLTIyNDQ4NjQ5Y2M0OCIsImlhdCI6MTc2NDMyMzMyMCwiZXhwIjoxNzY2OTE1MzIwfQ.7zpdaCdI55Pw_Y6vK9VnPQu3IaTI43X_Iw29N9cWrXQ', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-28 09:48:40', '2025-12-28 09:48:40', 1, '2025-11-28 09:48:40', '2025-12-04 09:16:56'),
('efb78ffc-9011-4159-a384-4dcf0baf0db9', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NDMyMzUzMCwiZXhwIjoxNzY2OTE1NTMwfQ.YvybNq-swCtukD6t4zyBk6UU7ab1fCSzToN_akM9FlY', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-11-28 09:52:10', '2025-12-28 09:52:10', 1, '2025-11-28 09:52:10', '2025-12-02 17:14:11'),
('f260d2be-5e37-4c0f-86e7-a0435e11aca0', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NzA5MDgyOSwiZXhwIjoxNzY5NjgyODI5fQ.DLD71tXquXU2wBXXI93avB46JQJiXNNkTER9udCCgcQ', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-30 10:33:49', '2026-01-29 10:33:49', 1, '2025-12-30 10:33:49', '2026-01-01 06:50:59'),
('f8a271a3-7a7a-4d4c-b75e-3dd5dd835b3c', 'e72b56c5-4527-4af9-b740-d161bf92c17d', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU3MmI1NmM1LTQ1MjctNGFmOS1iNzQwLWQxNjFiZjkyYzE3ZCIsImlhdCI6MTc2NDY5NTY1MSwiZXhwIjoxNzY3Mjg3NjUxfQ.5QSceE3jKl2agfTLPcjcBDRdaJa9ft1w0Vnby5sa51Q', '6fe7644a5835b3257edc76662771ffa183ac5aff8bb4c34ac993fb6a62cdf171', '', '', '', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-02 17:14:11', '2026-01-01 17:14:11', 1, '2025-12-02 17:14:11', '2025-12-29 13:13:36'),
('f9803e56-8605-4e8d-a83a-3ea87a7b35ff', 'f10e2cc3-a2e5-47e3-a1a2-22448649cc48', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYxMGUyY2MzLWEyZTUtNDdlMy1hMWEyLTIyNDQ4NjQ5Y2M0OCIsImlhdCI6MTc2NDY1NjM0NCwiZXhwIjoxNzY3MjQ4MzQ0fQ.6g9y-6DSm7VlHaJHxDuf4_E2c0QvYRNHcQCMEaVH260', '40dbc47a6a1621967ede3ce61c53b6a627f3f4efea4c4842ce14285c1470bce2', '', '', '', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-02 06:19:04', '2026-01-01 06:19:04', 1, '2025-12-02 06:19:04', '2025-12-30 10:37:33');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course_id`),
  ADD UNIQUE KEY `public_id` (`public_id`),
  ADD KEY `level_id` (`level_id`);

--
-- Indexes for table `course_comment`
--
ALTER TABLE `course_comment`
  ADD PRIMARY KEY (`comment_id`),
  ADD UNIQUE KEY `public_id` (`public_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `courseId` (`courseId`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `course_videos`
--
ALTER TABLE `course_videos`
  ADD PRIMARY KEY (`course_video_id`),
  ADD UNIQUE KEY `public_id` (`public_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`exam_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`level_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `payment_method`
--
ALTER TABLE `payment_method`
  ADD PRIMARY KEY (`method_id`),
  ADD UNIQUE KEY `method_name` (`method_name`),
  ADD UNIQUE KEY `account_number` (`account_number`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`report_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `public_id` (`public_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `student_class`
--
ALTER TABLE `student_class`
  ADD PRIMARY KEY (`class_id`),
  ADD UNIQUE KEY `public_id` (`public_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `level_id` (`level_id`);

--
-- Indexes for table `student_exam_answers`
--
ALTER TABLE `student_exam_answers`
  ADD PRIMARY KEY (`exam_answer_id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `exam_id` (`exam_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `student_payment`
--
ALTER TABLE `student_payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `public_id` (`public_id`),
  ADD UNIQUE KEY `transaction_no` (`transaction_no`),
  ADD UNIQUE KEY `receipt` (`receipt`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `method_id` (`method_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD UNIQUE KEY `subject_name` (`subject_name`);

--
-- Indexes for table `system_information`
--
ALTER TABLE `system_information`
  ADD PRIMARY KEY (`system_id`),
  ADD UNIQUE KEY `system_phone` (`system_phone`),
  ADD UNIQUE KEY `system_email` (`system_email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `public_id` (`public_id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `course_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `course_comment`
--
ALTER TABLE `course_comment`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `course_videos`
--
ALTER TABLE `course_videos`
  MODIFY `course_video_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `exams`
--
ALTER TABLE `exams`
  MODIFY `exam_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `exam_questions`
--
ALTER TABLE `exam_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `levels`
--
ALTER TABLE `levels`
  MODIFY `level_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_method`
--
ALTER TABLE `payment_method`
  MODIFY `method_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `report_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_class`
--
ALTER TABLE `student_class`
  MODIFY `class_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `student_exam_answers`
--
ALTER TABLE `student_exam_answers`
  MODIFY `exam_answer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_payment`
--
ALTER TABLE `student_payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `system_information`
--
ALTER TABLE `system_information`
  MODIFY `system_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `levels` (`level_id`) ON UPDATE CASCADE;

--
-- Constraints for table `course_comment`
--
ALTER TABLE `course_comment`
  ADD CONSTRAINT `course_comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `course_comment_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `courses` (`course_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `course_comment_ibfk_3` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `course_videos`
--
ALTER TABLE `course_videos`
  ADD CONSTRAINT `course_videos_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `exams`
--
ALTER TABLE `exams`
  ADD CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`course_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `exam_questions`
--
ALTER TABLE `exam_questions`
  ADD CONSTRAINT `exam_questions_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `levels`
--
ALTER TABLE `levels`
  ADD CONSTRAINT `levels_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON UPDATE CASCADE;

--
-- Constraints for table `student_class`
--
ALTER TABLE `student_class`
  ADD CONSTRAINT `student_class_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `student_class_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `levels` (`level_id`) ON UPDATE CASCADE;

--
-- Constraints for table `student_exam_answers`
--
ALTER TABLE `student_exam_answers`
  ADD CONSTRAINT `student_exam_answers_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `student_class` (`class_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `student_exam_answers_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `student_exam_answers_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `exam_questions` (`question_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `student_payment`
--
ALTER TABLE `student_payment`
  ADD CONSTRAINT `student_payment_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `student_class` (`class_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `student_payment_ibfk_2` FOREIGN KEY (`method_id`) REFERENCES `payment_method` (`method_id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
