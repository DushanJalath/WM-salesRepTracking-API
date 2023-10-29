-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 29, 2023 at 09:53 AM
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
-- Database: `rep_track`
--

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `mobileNo` varchar(15) NOT NULL,
  `repId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`id`, `name`, `address`, `mobileNo`, `repId`) VALUES
(1, 'Customer1', 'Address1', '1111111111', 1),
(2, 'Customer2', 'Address2', '2222222222', 1),
(3, 'Customer3', 'Address3', '3333333333', 2),
(4, 'Customer4', 'Address4', '4444444444', 2),
(5, 'Customer5', 'Address5', '5555555555', 2);

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `repId` int(11) NOT NULL,
  `location` varchar(100) NOT NULL,
  `timeStamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`id`, `repId`, `location`, `timeStamp`) VALUES
(1, 1, 'Location1', '2023-10-28 06:06:44'),
(2, 1, 'Location2', '2023-10-28 06:06:44'),
(3, 2, 'Location3', '2023-10-28 06:06:44'),
(4, 2, 'Location4', '2023-10-28 06:06:44'),
(5, 2, 'Location5', '2023-10-28 06:06:44'),
(6, 2, 'Dushan', '2023-10-28 07:06:19');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `salesId` int(11) NOT NULL,
  `repId` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `itemName` varchar(60) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `paymentMethod` varchar(10) DEFAULT NULL,
  `bank` varchar(30) DEFAULT NULL,
  `branch` varchar(30) DEFAULT NULL,
  `cheque_no` varchar(70) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `remarks` varchar(150) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`salesId`, `repId`, `customerId`, `itemName`, `qty`, `paymentMethod`, `bank`, `branch`, `cheque_no`, `amount`, `remarks`, `time`) VALUES
(1, 1, 1, 'Item1', 10, 'Cash', 'Bank1', 'Branch1', NULL, 100, 'Sale1', '2023-10-28 06:06:44'),
(2, 1, 2, 'Item2', 5, 'Credit', 'Bank2', 'Branch2', NULL, 50, 'Sale2', '2023-10-28 06:06:44'),
(3, 2, 3, 'Item3', 8, 'Cash', 'Bank1', 'Branch1', NULL, 80, 'Sale3', '2023-10-28 06:06:44'),
(4, 2, 4, 'Item4', 12, 'Credit', 'Bank2', 'Branch2', NULL, 120, 'Sale4', '2023-10-28 06:06:44'),
(5, 2, 5, 'Item5', 15, 'Cash', 'Bank3', 'Branch3', NULL, 150, 'Sale5', '2023-10-28 06:06:44');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `userName` varchar(20) NOT NULL,
  `pw` varchar(20) NOT NULL,
  `mobileNo` varchar(15) NOT NULL,
  `address` varchar(100) NOT NULL,
  `type` varchar(20) NOT NULL,
  `managerId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `userName`, `pw`, `mobileNo`, `address`, `type`, `managerId`) VALUES
(1, 'User1', 'user1', 'userpass1', '1111111111', 'Address1', 'salesperson', NULL),
(2, 'User2', 'user2', 'userpass2', '2222222222', 'Address2', 'salesperson', 1),
(3, 'User3', 'user3', 'userpass3', '3333333333', 'Address3', 'salesperson', NULL),
(4, 'User4', 'user4', 'userpass4', '4444444444', 'Address4', 'salesperson', 2),
(5, 'User5', 'user5', 'userpass5', '5555555555', 'Address5', 'salesperson', 2),
(6, 'John Doe', 'johndoe', 'password123', '1234567890', '123 Main St, City', 'user', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `repId` (`repId`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`),
  ADD KEY `repId` (`repId`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`salesId`),
  ADD KEY `repId` (`repId`),
  ADD KEY `customerId` (`customerId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `managerId` (`managerId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `salesId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customer`
--
ALTER TABLE `customer`
  ADD CONSTRAINT `customer_ibfk_1` FOREIGN KEY (`repId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `location`
--
ALTER TABLE `location`
  ADD CONSTRAINT `location_ibfk_1` FOREIGN KEY (`repId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`repId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`customerId`) REFERENCES `customer` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`managerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
