CREATE DATABASE Match3
	CHARACTER SET utf8
	COLLATE utf8_hungarian_ci;

CREATE TABLE match3.jatekosok (
  id INT(11) NOT NULL AUTO_INCREMENT,
  felhasznaloNev VARCHAR(50) NOT NULL UNIQUE,
  jelszo VARCHAR(255) NOT NULL,
  baratok VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE match3.jatszmak (
  id INT(11) NOT NULL AUTO_INCREMENT,
  jatekos1_id INT(11) NOT NULL,
  jatekos2_id INT(11) NOT NULL,
  jatekos1_pont INT(11) NOT NULL,
  jatekos2_pont INT(11) NOT NULL,
  allapot INT(1) NOT NULL,
  jatekIdo INT(11) DEFAULT NULL,
  maxIdo INT(11) NOT NULL,
  nehezseg INT(11) NOT NULL,
  PRIMARY KEY (id)
);

-- Tervek

-- Teszt játékosok