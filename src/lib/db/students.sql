-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 07, 2026 at 04:40 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sabrastay`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
CREATE TABLE IF NOT EXISTS `appointments` (
  `appointmentID` int NOT NULL AUTO_INCREMENT,
  `studentID` int DEFAULT NULL,
  `boardingID` int DEFAULT NULL,
  `appointmentDate` date DEFAULT NULL,
  `appointmentTime` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`appointmentID`),
  KEY `studentID` (`studentID`),
  KEY `boardingID` (`boardingID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `boarding_owners`
--

DROP TABLE IF EXISTS `boarding_owners`;
CREATE TABLE IF NOT EXISTS `boarding_owners` (
  `boardingOwnerID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `contactNo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`boardingOwnerID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `boarding_owners`
--

INSERT INTO `boarding_owners` (`boardingOwnerID`, `firstName`, `lastName`, `email`, `password`, `contactNo`) VALUES
(1, 'Kamali', 'Perera', 'kamali@student.com', '$2b$10$hXZ1mkUcIph67GdJBeYNVuOaq1.kYiArIkaNkI5RnL4urCVcIsWDa', '0771234564'),
(2, 'Sadew', 'Aththanayaka', 'sadew@gmail.com', '$2b$10$7LJOS.tca3rPHuGOw9PRae4Ot6ansDfXZGrXnhjFaI8WZOo9gX3ma', '0762286926');

-- --------------------------------------------------------

--
-- Table structure for table `boarding_photos`
--

DROP TABLE IF EXISTS `boarding_photos`;
CREATE TABLE IF NOT EXISTS `boarding_photos` (
  `photoID` int NOT NULL AUTO_INCREMENT,
  `boardingID` int DEFAULT NULL,
  `photoPath` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`photoID`),
  KEY `boardingID` (`boardingID`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `boarding_photos`
--

INSERT INTO `boarding_photos` (`photoID`, `boardingID`, `photoPath`) VALUES
(1, 1, 'uploads\\boarding\\1778419166833-646545555.png'),
(2, 2, 'uploads\\boarding\\1778419531699-566767286.jpg'),
(3, 3, 'uploads\\boarding\\1778569341865-874107608.jpg'),
(4, 4, 'uploads\\boarding\\1779157589223-707561759.JPG'),
(5, 5, 'uploads\\boarding\\1779158538249-971432579.JPG'),
(6, 6, 'uploads\\boarding\\1779186741680-93865688.JPG'),
(7, 7, 'uploads\\boarding\\1779543933926-904803515.jpg'),
(8, 8, 'uploads\\boarding\\1779589101207-616289051.jpg'),
(9, 9, 'uploads\\boarding\\1780409022667-132451925.JPG'),
(10, 10, 'uploads\\boarding\\1780410961437-415974152.jpg'),
(11, 10, 'uploads\\boarding\\1780410961440-376778515.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `boarding_places`
--

DROP TABLE IF EXISTS `boarding_places`;
CREATE TABLE IF NOT EXISTS `boarding_places` (
  `boardingID` int NOT NULL AUTO_INCREMENT,
  `boardingOwnerID` int DEFAULT NULL,
  `boardingName` varchar(150) DEFAULT NULL,
  `boardingType` varchar(50) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `totalRooms` int DEFAULT NULL,
  `availableSpace` int DEFAULT NULL,
  `description` text,
  `distance` decimal(5,2) DEFAULT NULL,
  `freeWifi` tinyint(1) DEFAULT '0',
  `attachedBathroom` tinyint(1) DEFAULT '0',
  `parking` tinyint(1) DEFAULT '0',
  `kitchen` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`boardingID`),
  KEY `boardingOwnerID` (`boardingOwnerID`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `boarding_places`
--

INSERT INTO `boarding_places` (`boardingID`, `boardingOwnerID`, `boardingName`, `boardingType`, `address`, `price`, `totalRooms`, `availableSpace`, `description`, `distance`, `freeWifi`, `attachedBathroom`, `parking`, `kitchen`) VALUES
(1, NULL, 'Kamali\'s boarding house', 'Male', 'Belihuloya, Balangoda', 25000.00, 4, 7, 'good', 1.20, 0, 0, 0, 0),
(2, NULL, 'Kamal\'s boarding house', 'Female', 'Belihuloya, Balangoda', 35000.00, 5, 15, 'Good and clam place. ', 1.20, 0, 0, 0, 0),
(3, NULL, 'Kamal\'s boarding house', 'Female', 'Belihuloya, Balangoda', 25000.00, 5, 15, 'good place', 1.20, 0, 0, 0, 0),
(4, NULL, 'Nimal\'s boarding house', 'Male', 'Belihuloya, Balangoda', 21000.00, 1, 7, 'good', 0.30, 0, 0, 0, 0),
(6, 1, 'Savindu\'s boarding', 'Male', 'Belihuloya, Rathnapura', 152000.00, 8, 15, 'Good place to stay', 0.20, 1, 1, 1, 1),
(7, 2, 'Sadew\'s boarding', 'Female', 'Belihuloya, Balangoda', 75000.00, 5, 15, 'Good place to stay. ', 1.20, 0, 1, 1, 0),
(8, 1, 'Palage\'s Boarding', 'Male', 'Belihuloya, Balangoda', 80000.00, 4, 12, 'Clean and good place.', 1.30, 0, 1, 1, 1),
(10, 1, 'Palage aiya rooms', 'Male', 'Belihuloya, Balangoda', 40000.00, 2, 4, 'Bonn puluwan', 0.40, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `boarding_id` int DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `start_date` date DEFAULT NULL,
  `months` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `boarding_id`, `status`, `created_at`, `start_date`, `months`) VALUES
(1, NULL, 1, 'PENDING', '2026-04-28 05:27:23', NULL, NULL),
(2, NULL, 1, 'PENDING', '2026-04-28 05:36:32', NULL, NULL),
(7, 5, 1, 'PENDING', '2026-04-29 04:07:51', NULL, NULL),
(4, 5, 1, 'PENDING', '2026-04-28 13:18:41', NULL, NULL),
(5, 5, 1, 'PENDING', '2026-04-28 13:32:46', NULL, NULL),
(6, 5, 1, 'PENDING', '2026-04-28 13:37:28', NULL, NULL),
(29, 5, 8, 'CONFIRMED', '2026-06-02 13:07:01', NULL, NULL),
(9, 5, 1, 'PENDING', '2026-04-29 10:09:26', NULL, NULL),
(10, 5, 1, 'PENDING', '2026-05-03 14:45:24', NULL, NULL),
(11, 5, 1, 'PENDING', '2026-05-03 15:39:47', NULL, NULL),
(32, 8, 6, 'PENDING', '2026-06-04 05:09:21', NULL, NULL),
(14, 5, 1, 'PENDING', '2026-05-06 14:11:55', NULL, NULL),
(15, 5, 1, 'PENDING', '2026-05-07 08:16:36', NULL, NULL),
(33, 8, 10, 'PENDING', '2026-06-04 14:04:06', NULL, NULL),
(17, 5, 1, 'PENDING', '2026-05-10 08:04:59', NULL, NULL),
(18, 5, 1, 'PENDING', '2026-05-12 06:53:20', NULL, NULL),
(19, 5, 1, 'PENDING', '2026-05-18 14:10:32', NULL, NULL),
(20, 5, 1, 'PENDING', '2026-05-18 15:08:05', NULL, NULL),
(21, 5, 6, 'CONFIRMED', '2026-05-19 16:50:01', NULL, NULL),
(22, 5, 6, 'PENDING', '2026-05-20 02:52:24', NULL, NULL),
(23, 5, 6, 'CONFIRMED', '2026-05-22 13:33:32', NULL, NULL),
(24, 5, 6, 'PENDING', '2026-05-22 13:42:01', NULL, NULL),
(25, 2, 7, 'PENDING', '2026-05-23 13:47:22', NULL, NULL),
(26, 5, 8, 'PENDING', '2026-06-02 09:51:51', NULL, NULL),
(27, 5, 8, 'CONFIRMED', '2026-06-02 10:17:00', NULL, NULL),
(28, 5, 8, 'CONFIRMED', '2026-06-02 10:32:03', NULL, NULL),
(30, 5, 10, 'PENDING', '2026-06-02 15:47:48', NULL, NULL),
(31, 7, 10, 'PENDING', '2026-06-03 11:57:14', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `notificationID` int NOT NULL AUTO_INCREMENT,
  `studentID` int DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `createdDate` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`notificationID`),
  KEY `studentID` (`studentID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `role` enum('student','owner') NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `token` (`token`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`id`, `email`, `role`, `token`, `expires_at`, `used`, `created_at`) VALUES
(1, 'kamala@student.com', 'student', '1098bf6b9882b0f4dff5f2bfa2abe41dcdaea1d1326dbb13b4b3f81f8bdd38bc', '2026-05-18 11:44:05', 0, '2026-05-18 16:14:05'),
(2, 'kamala@student.com', 'student', 'd41ac78d5be1f7f62d7eac168484af1033aad62b81eaf4676b1344b4f4ca5233', '2026-05-18 11:46:17', 0, '2026-05-18 16:16:17'),
(3, 'kamala@student.com', 'student', 'd51ed697d3f03c362ae5266adb704e6bb64018aedd86e5cca0b88d7b93119763', '2026-05-18 17:19:51', 1, '2026-05-18 16:19:51');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE IF NOT EXISTS `reviews` (
  `reviewID` int NOT NULL AUTO_INCREMENT,
  `studentID` int DEFAULT NULL,
  `boardingID` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `reviewDate` date DEFAULT NULL,
  PRIMARY KEY (`reviewID`),
  KEY `studentID` (`studentID`),
  KEY `boardingID` (`boardingID`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`reviewID`, `studentID`, `boardingID`, `rating`, `comment`, `reviewDate`) VALUES
(1, 5, 1, 4, 'good', '2026-05-06'),
(2, 5, 1, 5, 'Very good place', '2026-05-06'),
(4, 5, 1, 4, 'good place', '2026-05-12'),
(5, 5, 1, 5, 'good place. nice and friendly owner.', '2026-05-18'),
(6, 5, 6, 5, 'Good', '2026-05-20');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `studentID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `contactNo` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`studentID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`studentID`, `firstName`, `lastName`, `email`, `password`, `contactNo`) VALUES
(1, 'Kamal', 'Perera', 'kamal@student.com', '$2b$10$cO0nnGZudHWHhHnjwU1Liu/lO8rS0f53khcPUtY9d6DxSimC8zBVi', '0771234567'),
(2, 'Kamala', 'Perera', 'kamala@student.com', '$2b$10$Ip0OF71kz5Z5.4M3wgKtfOZIAyEdfi5pEkpy4NdSThddl.C9LkbCG', '0771234564'),
(3, 'heshan', 'deemantha', 'heshan@gmail.com', '$2b$10$XFVejah38rgXFKXaYYhXYeTQkywUrxv1TmkMdQc.SbzDPNweqTk1S', '0774568528'),
(4, 'Savindu', 'Nadeeja', 'savindu@gmail.com', '$2b$10$jARvROAft6byy.2O89KJtOk2XBzRBrpC1h5nKP/kjL4f0XcJF70zq', '0774330812'),
(5, 'Udith', 'Indrachapa', 'udith@gmail.com', '$2b$10$R6y.5hEuSMrt7xb7JXqlRubHZYIRXW6kwz1dfDf0XYCislOkgeowG', '0774330816'),
(6, 'jayami', 'sulakshi', 'jayami@gmail.com', '$2b$10$8vGD7ErARnGisqoBJ725nOcFrd8Z083Osvt7k1SxgPvrPoudV1S8u', '0774330816'),
(7, 'Savindu', 'Nadeeja', 'savindunadeeja@gmail.com', '$2b$10$AzB/KCDexIaDXTGTp6NRHuxnvFlrWcc1udObIvcC6NiObgb/HVv36', '0774330814'),
(8, 'Udith', 'Indrachapa', 'udithindrachapa83@gmail.com', '$2b$10$NQsYlHGfiqEFsxYYo6TgbOSAVB6ZIpgxszd.uLqdHJ.Uq672CVDNK', '0701904773');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
