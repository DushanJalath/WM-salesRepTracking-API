-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 28, 2023 at 06:07 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sales_track`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--



-- --------------------------------------------------------
--
-- Table structure for table `user`
--

-- Create the user table
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `userName` varchar(20) NOT NULL,
  `pw` varchar(20) NOT NULL,
  `mobileNo` varchar(15) NOT NULL,
  `address` varchar(100) NOT NULL,
  `type` varchar(20) NOT NULL,
  `managerId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (managerId) REFERENCES user(id)  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Create the location table
CREATE TABLE `location` (
   `id` int(11) NOT NULL AUTO_INCREMENT,
  `repId` int(11) NOT NULL,
  `location` varchar(100) NOT NULL,
  `timeStamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (repId) REFERENCES user(id)  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Create the customer table
CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `mobileNo` varchar(15) NOT NULL,
  `repId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (repId) REFERENCES user(id)  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create the sales table
CREATE TABLE `sales` (
  `salesId` int(11) NOT NULL AUTO_INCREMENT,
  `repId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `itemName` varchar(60) NOT NULL,
  `qty` int(11) NOT NULL,
  `paymentMethod` varchar(10) NOT NULL,
  `bank` varchar(30) NOT NULL,
  `branch` varchar(30) NOT NULL,
  `amount` int(11) NOT NULL,
  `remarks` varchar(150) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`salesId`),
  FOREIGN KEY (repId) REFERENCES user(id)  ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (customerId) REFERENCES customer(id)  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

INSERT INTO `user` (`name`, `userName`, `pw`, `mobileNo`, `address`, `type`, `managerId`) VALUES
('User1', 'user1', 'userpass1', '1111111111', 'Address1', 'salesperson', NULL),
('User2', 'user2', 'userpass2', '2222222222', 'Address2', 'salesperson', 1),
('User3', 'user3', 'userpass3', '3333333333', 'Address3', 'salesperson', NULL),
('User4', 'user4', 'userpass4', '4444444444', 'Address4', 'salesperson', 2),
('User5', 'user5', 'userpass5', '5555555555', 'Address5', 'salesperson', 2);

INSERT INTO `location` (`repId`, `location`) VALUES
(1, 'Location1'),
(1, 'Location2'),
(2, 'Location3'),
(2, 'Location4'),
(2, 'Location5');

INSERT INTO `customer` (`name`, `address`, `mobileNo`, `repId`) VALUES
('Customer1', 'Address1', '1111111111', 1),
('Customer2', 'Address2', '2222222222', 1),
('Customer3', 'Address3', '3333333333', 2),
('Customer4', 'Address4', '4444444444', 2),
('Customer5', 'Address5', '5555555555', 2);

INSERT INTO `sales` (`repId`, `customerId`, `itemName`, `qty`, `paymentMethod`, `bank`, `branch`, `amount`, `remarks`) VALUES
(1, 1, 'Item1', 10, 'Cash', 'Bank1', 'Branch1', 100, 'Sale1'),
(1, 2, 'Item2', 5, 'Credit', 'Bank2', 'Branch2', 50, 'Sale2'),
(2, 3, 'Item3', 8, 'Cash', 'Bank1', 'Branch1', 80, 'Sale3'),
(2, 4, 'Item4', 12, 'Credit', 'Bank2', 'Branch2', 120, 'Sale4'),
(2, 5, 'Item5', 15, 'Cash', 'Bank3', 'Branch3', 150, 'Sale5');






COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
