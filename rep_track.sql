
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS rep_track;
CREATE DATABASE rep_track;
USE rep_track;


CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `userName` varchar(20) NOT NULL,
  `pw` varchar(20) NOT NULL,
  `mobileNo` varchar(15) NOT NULL,
  `address` varchar(100) NOT NULL,
  `type` varchar(20) NOT NULL,
  `managerId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `user` (`id`, `name`, `userName`, `pw`, `mobileNo`, `address`, `type`, `managerId`) VALUES
(1, 'User1', 'user1', 'userpass1', '1111111111', 'Address1', 'salesperson', NULL),
(2, 'User2', 'user2', 'userpass2', '2222222222', 'Address2', 'salesperson', 1),
(3, 'User3', 'user3', 'userpass3', '3333333333', 'Address3', 'salesperson', NULL),
(4, 'User4', 'user4', 'userpass4', '4444444444', 'Address4', 'salesperson', 2),
(5, 'User5', 'user5', 'userpass5', '5555555555', 'Address5', 'salesperson', 2),
(6, 'John Doe', 'johndoe', 'password123', '1234567890', '123 Main St, City', 'user', NULL);



CREATE TABLE `location` (
   `id` int NOT NULL AUTO_INCREMENT,
  `repId` int NOT NULL,
   `lat` float NOT NULL,
   `lng` float NOT NULL,
  `timeStamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  FOREIGN KEY (repId) REFERENCES user(id)  ON DELETE CASCADE ON UPDATE CASCADE
);


-- Create the customer table
CREATE TABLE `customer` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `mobileNo` varchar(15) NOT NULL,
  `repId` int NOT NULL,
  `lat` float DEFAULT NULL,
  `lng` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (repId) REFERENCES user(id)  ON DELETE CASCADE ON UPDATE CASCADE
) ;


INSERT INTO `customer` (`id`, `name`, `address`, `mobileNo`, `repId`) VALUES
(1, 'Customer1', 'Address1', '1111111111', 1),
(2, 'Customer2', 'Address2', '2222222222', 1),
(3, 'Customer3', 'Address3', '3333333333', 2),
(4, 'Customer4', 'Address4', '4444444444', 2),
(5, 'Customer5', 'Address5', '5555555555', 2);



-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `salesId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `repId` int NOT NULL,
  `customerId` int NOT NULL,
  `itemName` varchar(60) DEFAULT NULL,
  `qty` int DEFAULT NULL,
  `paymentMethod` varchar(10) DEFAULT NULL,
  `bank` varchar(30) DEFAULT NULL,
  `branch` varchar(30) DEFAULT NULL,
  `cheque_no` varchar(70) DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `remarks` varchar(150) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  FOREIGN KEY (repId) REFERENCES user(id)  ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (customerId) REFERENCES customer(id)  ON DELETE CASCADE ON UPDATE CASCADE
) ;

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


COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


