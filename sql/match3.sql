# Adatbázis létrehozása
CREATE DATABASE match3
	CHARACTER SET utf8
	COLLATE utf8_hungarian_ci;


# Táblák létrehozása --- START ---
# jatekosok
CREATE TABLE match3.jatekosok (
  id INT(11) NOT NULL AUTO_INCREMENT,
  felhasznalonev VARCHAR(50) DEFAULT 'Törölt Felhasználó',
  jelszo VARCHAR(100) DEFAULT NULL,
  email VARCHAR(50) DEFAULT NULL,
  profilkep VARCHAR(255) DEFAULT 'logo.png',
  online TINYINT(1) DEFAULT 0,
  PRIMARY KEY (id)
);

# barátok
CREATE TABLE match3.baratok (
  jatekos1_id INT(11) NOT NULL,
  jatekos2_id INT(11) NOT NULL
);


# jatszmaLepesek
CREATE TABLE match3.jatszmaLepesek (
  id INT(11) NOT NULL AUTO_INCREMENT,
  jatszmakId INT(11) NOT NULL,
  jatekosId INT(11) NOT NULL,
  selected1_X INT(11) NOT NULL,
  selected1_Y INT(11) NOT NULL,
  selected2_X INT(11) NOT NULL,
  selected2_Y INT(11) NOT NULL,
  PRIMARY KEY (id)
);


# jatszmak
CREATE TABLE match3.jatszmak (
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
);

# Összekapcsolás
    ALTER TABLE match3.baratok 
  ADD CONSTRAINT FK_baratok_jatekosok_id FOREIGN KEY (jatekos1_id)
    REFERENCES match3.jatekosok(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE match3.baratok 
  ADD CONSTRAINT FK_baratok_jatekosok_id_2 FOREIGN KEY (jatekos2_id)
    REFERENCES match3.jatekosok(id) ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE match3.jatszmak 
  ADD CONSTRAINT FK_jatszmak_jatekosok_id FOREIGN KEY (jatekos1_id)
    REFERENCES match3.jatekosok(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE match3.jatszmak 
  ADD CONSTRAINT FK_jatszmak_jatekosok_id2 FOREIGN KEY (jatekos2_id)
    REFERENCES match3.jatekosok(id) ON DELETE CASCADE ON UPDATE CASCADE;

  ALTER TABLE match3.jatszmalepesek 
  ADD CONSTRAINT FK_jatszmalepesek_jatszmak_id FOREIGN KEY (jatszmakId)
    REFERENCES match3.jatszmak(id) ON DELETE CASCADE ON UPDATE CASCADE;


# Táblák létrehozása --- END ---

# Teszt adatok --- START ---

  # Adatok törlése
  DELETE FROM jatekosok;
  DELETE FROM baratok;
  DELETE FROM jatszmak;
  DELETE FROM jatszmaLepesek;

  # jatekosok
  INSERT INTO jatekosok (felhasznalonev, jelszo, email, profilkep)
    VALUES 
    ('Lysander13', '$2y$10$lhjNktYlWbQn42Q6dfIQBOJwGm5gsfdExQpKK1R6w247WQ/sQK48S', 'lysander13@example.com', 'Lysander13.png'),
    ('Mario_1105', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Mario_1105@example.com', 'Mario_1105.png'),
    ('pillebogar', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'pillebogar@example.com', 'pillebogar.jpg'),
    ('Ambuss', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Ambuss@example.com', 'Ambuss.jpg'),
    ('JGabor', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'JGabor@example.com', 'JGabor.jpg'),
    ('Ardect', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Ardect@example.com', default),
    ('Backender', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Backender@example.com', 'Backender.jpg'),
    ('Cintia', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK', 'Cintia@example.com', 'Cintia.jpg');

  # baratok
  INSERT INTO baratok (jatekos1_id, jatekos2_id)
    VALUES
    (1,3),
    (1,5),
    (1,7),
    (2,7),
    (3,2),
    (3,4),
    (3,5),
    (3,6),
    (3,7),
    (4,5),
    (4,6);

  # Dublikáció a barátok között
  INSERT INTO baratok (jatekos1_id, jatekos2_id)
    VALUE (3, 1);

  # jatszmak
  INSERT INTO jatszmak (jatekos1_id, jatekos2_id, jatekos1_pont, jatekos2_pont, allapot, jatekido, maxido, nehezseg)
    VALUES
    (1,2,800,500,0,120000,120000,1),
    (1,7,300,100,0,300000,300000,3),
    (1,3,400,300,0,180000,180000,2),
    (1,6,1200,700,0,120000,120000,1),
    (1,4,1000,1100,0,180000,180000,2),
    (1,2,1300,1300,0,300000,300000,3),
    (1,7,100,600,0,120000,120000,1),
    (1,4,900,1000,0,120000,120000,1),
    (1,5,200,100,0,120000,120000,1),
    (1,3,500,800,0,300000,300000,3),
    (3,7,800,300,0,180000,180000,2),
    (3,5,1100,1000,0,180000,180000,2),
    (3,1,300,1000,0,300000,300000,3),
    (3,1,600,200,0,120000,120000,1),
    (3,2,600,1300,0,180000,180000,2),
    (3,5,1500,500,0,180000,180000,2),
    (5,7,1000,800,0,120000,120000,1),
    (7,2,700,1100,0,180000,180000,2),
    (2,7,1000,1200,0,120000,120000,1),
    (5,6,500,1400,0,120000,120000,1);
  


# Teszt adatok --- END ---

call GenerateTeszt();

# Lekérdezések
  SELECT * FROM jatekosok;
  SELECT * FROM baratok;
  SELECT * FROM jatszmak;
  SELECT * FROM jatszmaLepesek;

  # Adott játszma a jatszmak táblában
  SELECT * FROM jatszmak
    WHERE id = 1;

  # Futó játszmák, ahol még nincs 2. játékos
    SELECT * FROM jatszmak
      WHERE allapot = 1 AND jatekos2_id IS NULL;

  # Adott játszma lépés keresése jatszmaId alapján
    SELECT * FROM jatszmaLepesek
      WHERE jatszmakId = 38; 

  #Toplista
  SELECT j.id, j.felhasznalonev, SUM(tbl.pont)  as 'Rangsor pontszám' FROM
                      (SELECT id, jatekos1_id as jatekos_id,  (jatekos1_pont - jatekos2_pont) as pont FROM jatszmak
                      UNION ALL
                      SELECT id, jatekos2_id as jatekos_id, (jatekos2_pont - jatekos1_pont) as pont FROM jatszmak
                      ) as tbl
  INNER JOIN jatekosok j ON j.id = tbl.jatekos_id
  GROUP BY j.id
  ORDER BY `Rangsor pontszám` DESC
  LIMIT 3;

  #Bottomlista
  SELECT j.id, j.felhasznalonev, SUM(tbl.pont)  as 'Rangsor pontszám' FROM
                      (SELECT id, jatekos1_id as jatekos_id,  (jatekos1_pont - jatekos2_pont) as pont FROM jatszmak
                      UNION ALL
                      SELECT id, jatekos2_id as jatekos_id, (jatekos2_pont - jatekos1_pont) as pont FROM jatszmak
                      ) as tbl
  INNER JOIN jatekosok j ON j.id = tbl.jatekos_id
  GROUP BY j.id
  ORDER BY `Rangsor pontszám` ASC
  LIMIT 3;

  # Játékos keresés
  SET @id = 5;
  SELECT id, felhasznalonev FROM jatekosok
    WHERE felhasznalonev LIKE '%%'
      AND id != @id 
      AND id NOT IN (SELECT j.id FROM baratok b
                      INNER JOIN jatekosok j ON j.id = b.jatekos2_id
                      WHERE b.jatekos1_id = @id
                    UNION ALL
                    SELECT j.id FROM baratok b
                      INNER JOIN jatekosok j ON j.id = b.jatekos1_id
                      WHERE b.jatekos2_id = @id);
  

  # Barátok
  SELECT j.id, j.felhasznalonev FROM baratok b
    INNER JOIN jatekosok j ON j.id = b.jatekos2_id
    WHERE b.jatekos1_id = 1
  UNION
  SELECT j.id, j.felhasznalonev FROM baratok b
    INNER JOIN jatekosok j ON j.id = b.jatekos1_id
    WHERE b.jatekos2_id = 1;

  # Játékos név by id
    SELECT felhasznalonev FROM jatekosok
      WHERE id = 2;

  # Rangsor Pontszam
  SET @jatekos = 5;
  SELECT tbl.jatekos_id, SUM(tbl.pont) as 'Rangsor pontszám' FROM
                      (SELECT jatekos1_id as jatekos_id, (jatekos1_pont - jatekos2_pont) as pont FROM jatszmak
                      UNION ALL
                      SELECT jatekos2_id as jatekos_id, (jatekos2_pont - jatekos1_pont) as pont FROM jatszmak
                      ) as tbl
    WHERE tbl.jatekos_id = @jatekos
    GROUP BY tbl.jatekos_id;

  # Legutobbi 10 jatszma
  SET @jatekos = 1;
  SELECT * FROM (
  SELECT jatszmak.id, felhasznalonev as ellenfel, jatekos1_pont as pont, jatekos2_pont as ellenfel_pont, jatekido, nehezseg FROM jatszmak
    INNER JOIN jatekosok ON jatekos2_id = jatekosok.id
    WHERE jatekos1_id = @jatekos
  UNION ALL
  SELECT jatszmak.id, felhasznalonev as ellenfel, jatekos2_pont as pont, jatekos1_pont as ellenfel_pont, jatekido, nehezseg FROM jatszmak
    INNER JOIN jatekosok ON jatekos1_id = jatekosok.id
    WHERE jatekos2_id = @jatekos) as tabla
  ORDER BY tabla.id DESC
  LIMIT 10;

  # Bejelentkezés
    SELECT * FROM jatekosok
     WHERE felhasznalonev = 'value';

# Insert
  # Regsztráció
  INSERT INTO jatekosok (email, felhasznalonev, jelszo)
    VALUE ('value1', 'value2');

  # Barátnak jelölés
    INSERT INTO baratok (jatekos1_id, jatekos2_id)
      VALUE (1, 2);

  # Játszmában Lépés
    INSERT INTO jatszmaLepesek 
      (jatszmakId, selected1_X, selected1_Y, selected2_X, selected2_Y)
      VALUES (1, 0, 0, 0, 1);

  # Új játék
    INSERT INTO jatszmak 
      (jatekos1_id, maxido, nehezseg, seed)
      VALUE (1, 300000, 2, 123456);

# Update
  # Jatekos update
  UPDATE jatekosok SET
    felhasznalonev = 'value', email = ''
    WHERE id = 'value';

  # Jelszó változtatás
  UPDATE jatekosok SET
    jelszo = 'value'
    WHERE id = 'value';

  # Játszma Update
  UPDATE jatszmak SET
    jatekos1_pont = 0,
    jatekos2_pont = 0,
    allapot = 0,
    jatekido = 0
    WHERE id = 'value';
  DROP TABLE jatszma_id;


# Delete
  # Barát törlése
  DELETE FROM baratok
    WHERE jatekos1_id = ? AND jatekos2_id = ?;

  #Fiók törlése
  DELETE FROM baratok
    WHERE jatekos1_id = ? OR jatekos2_id = ?;
  UPDATE jatekosok
    SET felhasznalonev = DEFAULT(felhasznalonev), jelszo = null, email = null, profilkep = 'logo.png', online = 0
    WHERE id = 'value';

  #Játszma törlés jatszmak táblából
    DELETE FROM jatszmak
      WHERE id = ?;

  #Lépés törlése
    DELETE FROM jatszmaLepesek
      WHERE jatszmakId = 38; 