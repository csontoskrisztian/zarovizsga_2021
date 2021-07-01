﻿--
-- Script was generated by Devart dbForge Studio 2019 for MySQL, Version 8.2.23.0
-- Product home page: http://www.devart.com/dbforge/mysql/studio
-- Script date 2021. 06. 07. 15:04:21
-- Server version: 5.5.5-10.4.11-MariaDB
-- Client version: 4.1
--

-- 
-- Disable foreign keys
-- 
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

-- 
-- Set SQL mode
-- 
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 
-- Set character set the client will use to send SQL statements to the server
--
SET NAMES 'utf8';

--
-- Set default database
--
USE match3;

--
-- Drop procedure `GenerateTeszt`
--
DROP PROCEDURE IF EXISTS GenerateTeszt;

--
-- Drop table `baratok`
--
DROP TABLE IF EXISTS baratok;

--
-- Drop table `jatszmalepesek`
--
DROP TABLE IF EXISTS jatszmalepesek;

--
-- Drop table `jatszmak`
--
DROP TABLE IF EXISTS jatszmak;

--
-- Drop table `jatekosok`
--
DROP TABLE IF EXISTS jatekosok;

--
-- Set default database
--
USE match3;

--
-- Create table `jatekosok`
--
CREATE TABLE jatekosok (
  id INT(11) NOT NULL AUTO_INCREMENT,
  felhasznalonev VARCHAR(50) DEFAULT 'Törölt Felhasználó',
  jelszo VARCHAR(100) DEFAULT NULL,
  email VARCHAR(50) DEFAULT NULL,
  profilkep VARCHAR(255) DEFAULT 'logo.png',
  online TINYINT(1) DEFAULT 0,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 9,
AVG_ROW_LENGTH = 2048,
CHARACTER SET utf8,
COLLATE utf8_hungarian_ci;

--
-- Create table `jatszmak`
--
CREATE TABLE jatszmak (
  id INT(11) NOT NULL AUTO_INCREMENT,
  jatekos1_id INT(11) NOT NULL,
  jatekos2_id INT(11) DEFAULT NULL,
  jatekos1_pont INT(11) DEFAULT 0,
  jatekos2_pont INT(11) DEFAULT 0,
  allapot INT(11) DEFAULT 1,
  jatekido INT(11) DEFAULT 0,
  maxido INT(11) NOT NULL,
  nehezseg INT(11) NOT NULL,
  seed INT(11) DEFAULT NULL,
  kor INT(11) DEFAULT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 22,
AVG_ROW_LENGTH = 780,
CHARACTER SET utf8,
COLLATE utf8_hungarian_ci;

--
-- Create foreign key
--
ALTER TABLE jatszmak 
  ADD CONSTRAINT FK_jatszmak_jatekosok_id FOREIGN KEY (jatekos1_id)
    REFERENCES jatekosok(id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create foreign key
--
ALTER TABLE jatszmak 
  ADD CONSTRAINT FK_jatszmak_jatekosok_id2 FOREIGN KEY (jatekos2_id)
    REFERENCES jatekosok(id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create table `jatszmalepesek`
--
CREATE TABLE jatszmalepesek (
  id INT(11) NOT NULL AUTO_INCREMENT,
  jatszmakId INT(11) NOT NULL,
  jatekosId INT(11) NOT NULL,
  selected1_X INT(11) NOT NULL,
  selected1_Y INT(11) NOT NULL,
  selected2_X INT(11) NOT NULL,
  selected2_Y INT(11) NOT NULL,
  PRIMARY KEY (id)
)
ENGINE = INNODB,
AUTO_INCREMENT = 9,
CHARACTER SET utf8,
COLLATE utf8_hungarian_ci;

--
-- Create foreign key
--
ALTER TABLE jatszmalepesek 
  ADD CONSTRAINT FK_jatszmalepesek_jatszmak_id FOREIGN KEY (jatszmakId)
    REFERENCES jatszmak(id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create table `baratok`
--
CREATE TABLE baratok (
  jatekos1_id INT(11) NOT NULL,
  jatekos2_id INT(11) NOT NULL
)
ENGINE = INNODB,
AVG_ROW_LENGTH = 1365,
CHARACTER SET utf8,
COLLATE utf8_hungarian_ci;

--
-- Create foreign key
--
ALTER TABLE baratok 
  ADD CONSTRAINT FK_baratok_jatekosok_id FOREIGN KEY (jatekos1_id)
    REFERENCES jatekosok(id) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Create foreign key
--
ALTER TABLE baratok 
  ADD CONSTRAINT FK_baratok_jatekosok_id_2 FOREIGN KEY (jatekos2_id)
    REFERENCES jatekosok(id) ON DELETE CASCADE ON UPDATE CASCADE;

DELIMITER $$

--
-- Create procedure `GenerateTeszt`
--
CREATE DEFINER = 'root'@'localhost'
PROCEDURE GenerateTeszt()
BEGIN
# Adatok törlése
DELETE
  FROM jatszmaLepesek;
DELETE
  FROM jatszmak;
DELETE
  FROM baratok;
DELETE
  FROM jatekosok;

  ALTER TABLE jatekosok AUTO_INCREMENT = 1;
  ALTER TABLE jatszmak AUTO_INCREMENT = 1;
  ALTER TABLE jatszmaLepesek AUTO_INCREMENT = 1;

INSERT INTO jatekosok (felhasznalonev, jelszo, email, profilkep)
  VALUES ('Lysander13', '$2y$10$lhjNktYlWbQn42Q6dfIQBOJwGm5gsfdExQpKK1R6w247WQ/sQK48S', 'lysander13@example.com', 'Lysander13.png'),
  ('Mario_1105', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Mario_1105@example.com', 'Mario_1105.png'),
  ('pillebogar', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'pillebogar@example.com', 'pillebogar.jpg'),
  ('Ambuss', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Ambuss@example.com', 'Ambuss.jpg'),
  ('JGabor', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'JGabor@example.com', 'JGabor.jpg'),
  ('Ardect', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Ardect@example.com', DEFAULT),
  ('Backender', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Backender@example.com', 'Backender.jpg'),
  ('Cintia', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Cintia@example.com', 'Cintia.jpg');

# baratok
INSERT INTO baratok (jatekos1_id, jatekos2_id)
  VALUES (1, 3),
  (1, 5),
  (1, 7),
  (2, 7),
  (3, 2),
  (3, 4),
  (3, 5),
  (3, 6),
  (3, 7),
  (4, 5),
  (4, 6);

# Dublikáció a barátok között
INSERT INTO baratok (jatekos1_id, jatekos2_id)
  VALUE (3, 1);

# jatszmak
INSERT INTO jatszmak (jatekos1_id, jatekos2_id, jatekos1_pont, jatekos2_pont, allapot, jatekido, maxido, nehezseg)
  VALUES (1, 2, 800, 500, 0, 120000, 120000, 1),
  (1, 7, 300, 100, 0, 300000, 300000, 3),
  (1, 3, 400, 300, 0, 180000, 180000, 2),
  (1, 6, 1200, 700, 0, 120000, 120000, 1),
  (1, 4, 1000, 1100, 0, 180000, 180000, 2),
  (1, 2, 1300, 1300, 0, 300000, 300000, 3),
  (1, 7, 100, 600, 0, 120000, 120000, 1),
  (1, 4, 900, 1000, 0, 120000, 120000, 1),
  (1, 5, 200, 100, 0, 120000, 120000, 1),
  (1, 3, 500, 800, 0, 300000, 300000, 3),
  (3, 7, 800, 300, 0, 180000, 180000, 2),
  (3, 5, 1100, 1000, 0, 180000, 180000, 2),
  (3, 1, 300, 1000, 0, 300000, 300000, 3),
  (3, 1, 600, 200, 0, 120000, 120000, 1),
  (3, 2, 600, 1300, 0, 180000, 180000, 2),
  (3, 5, 1500, 500, 0, 180000, 180000, 2),
  (5, 7, 1000, 800, 0, 120000, 120000, 1),
  (7, 2, 700, 1100, 0, 180000, 180000, 2),
  (2, 7, 1000, 1200, 0, 120000, 120000, 1),
  (5, 6, 500, 1400, 0, 120000, 120000, 1);




SELECT
  *
FROM jatekosok;
SELECT
  *
FROM baratok;
SELECT
  *
FROM jatszmak;
SELECT
  *
FROM jatszmaLepesek;
END
$$

DELIMITER ;

-- 
-- Dumping data for table jatekosok
--
INSERT INTO jatekosok VALUES
(1, 'Lysander13', '$2y$10$lhjNktYlWbQn42Q6dfIQBOJwGm5gsfdExQpKK1R6w247WQ/sQK48S', 'lysander13@example.com', 'Lysander13.png', 0),
(2, 'Mario_1105', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Mario_1105@example.com', 'Mario_1105.png', 0),
(3, 'pillebogar', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'pillebogar@example.com', 'pillebogar.jpg', 0),
(4, 'Ambuss', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Ambuss@example.com', 'Ambuss.jpg', 0),
(5, 'JGabor', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'JGabor@example.com', 'JGabor.jpg', 0),
(6, 'Ardect', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Ardect@example.com', 'logo.png', 0),
(7, 'Backender', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Backender@example.com', 'Backender.jpg', 0),
(8, 'Cintia', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Cintia@example.com', 'Cintia.jpg', 0);

-- 
-- Dumping data for table jatszmak
--
INSERT INTO jatszmak VALUES
(1, 1, 2, 800, 500, 0, 120000, 120000, 1, NULL, NULL),
(2, 1, 7, 300, 100, 0, 300000, 300000, 3, NULL, NULL),
(3, 1, 3, 400, 300, 0, 180000, 180000, 2, NULL, NULL),
(4, 1, 6, 1200, 700, 0, 120000, 120000, 1, NULL, NULL),
(5, 1, 4, 1000, 1100, 0, 180000, 180000, 2, NULL, NULL),
(6, 1, 2, 1300, 1300, 0, 300000, 300000, 3, NULL, NULL),
(7, 1, 7, 100, 600, 0, 120000, 120000, 1, NULL, NULL),
(8, 1, 4, 900, 1000, 0, 120000, 120000, 1, NULL, NULL),
(9, 1, 5, 200, 100, 0, 120000, 120000, 1, NULL, NULL),
(10, 1, 3, 500, 800, 0, 300000, 300000, 3, NULL, NULL),
(11, 3, 7, 800, 300, 0, 180000, 180000, 2, NULL, NULL),
(12, 3, 5, 1100, 1000, 0, 180000, 180000, 2, NULL, NULL),
(13, 3, 1, 300, 1000, 0, 300000, 300000, 3, NULL, NULL),
(14, 3, 1, 600, 200, 0, 120000, 120000, 1, NULL, NULL),
(15, 3, 2, 600, 1300, 0, 180000, 180000, 2, NULL, NULL),
(16, 3, 5, 1500, 500, 0, 180000, 180000, 2, NULL, NULL),
(17, 5, 7, 1000, 800, 0, 120000, 120000, 1, NULL, NULL),
(18, 7, 2, 700, 1100, 0, 180000, 180000, 2, NULL, NULL),
(19, 2, 7, 1000, 1200, 0, 120000, 120000, 1, NULL, NULL),
(20, 5, 6, 500, 1400, 0, 120000, 120000, 1, NULL, NULL),
(21, 1, 8, 400, 700, 0, 60000, 60000, 2, 748155, 1);

-- 
-- Dumping data for table jatszmalepesek
--
-- Table match3.jatszmalepesek does not contain any data (it is empty)

-- 
-- Dumping data for table baratok
--
INSERT INTO baratok VALUES
(1, 3),
(1, 5),
(1, 7),
(2, 7),
(3, 2),
(3, 4),
(3, 5),
(3, 6),
(3, 7),
(4, 5),
(4, 6),
(3, 1);

-- 
-- Restore previous SQL mode
-- 
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

-- 
-- Enable foreign keys
-- 
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;