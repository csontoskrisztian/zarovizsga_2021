# Adatbázis létrehozása
CREATE DATABASE match3
	CHARACTER SET utf8
	COLLATE utf8_hungarian_ci;


# Táblák létrehozása --- START ---
# jatekosok
CREATE TABLE match3.jatekosok (
  id INT(11) NOT NULL AUTO_INCREMENT,
  felhasznalonev VARCHAR(50) NOT NULL,
  jelszo VARCHAR(100) NULL,
  PRIMARY KEY (id)
);
ALTER TABLE match3.jatekosok 
  ADD UNIQUE INDEX felhasznalonev(felhasznalonev);

# barátok
CREATE TABLE match3.baratok (
  jatekos1_id INT(11) NOT NULL,
  jatekos2_id INT(11) NOT NULL
);


# jatszma_0
CREATE TABLE match3.jatszma_0 (
  X INT(11) NOT NULL,
  Y INT(11) NOT NULL,
  csempe_id INT(11) NOT NULL
);


# jatszmak
CREATE TABLE match3.jatszmak (
  id INT(11) NOT NULL AUTO_INCREMENT,
  jatekos1_id INT(11) NOT NULL,
  jatekos2_id INT(11) NOT NULL,
  jatekos1_pont INT(11) NOT NULL,
  jatekos2_pont INT(11) NOT NULL,
  allapot INT(11) NOT NULL,
  jatekido INT(11) NOT NULL,
  maxido INT(11) NOT NULL,
  nehezseg INT(11) NOT NULL,
  PRIMARY KEY (id)
);


# csempek
CREATE TABLE match3.csempek (
  id INT(11) NOT NULL AUTO_INCREMENT,
  ikon VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);


# Táblák létrehozása --- END ---

# Teszt adatok --- START ---

  call GenerateTeszt();

  # Adatok törlése
  DELETE FROM jatekosok;
  DELETE FROM baratok;
  DELETE FROM jatszma_0;
  DELETE FROM jatszmak;
  DELETE FROM csempek;

  # jatekosok
  INSERT INTO jatekosok (felhasznalonev, jelszo)
    VALUES 
    ('teszt1', '$2y$10$lhjNktYlWbQn42Q6dfIQBOJwGm5gsfdExQpKK1R6w247WQ/sQK48S'),
    ('teszt2', '$2y$10$9nRBnT1QjllaAY0oG.uJPeL5ZRLWMBQwZ.s746SbxN/RA58iURLvK');

  # baratok
  INSERT INTO baratok (jatekos1_id, jatekos2_id)
    VALUE
    (1, 2);

  # jatszmak
  INSERT INTO jatszmak (jatekos1_id, jatekos2_id, jatekos1_pont, jatekos2_pont, allapot, jatekido, maxido, nehezseg)
    VALUES (1, 2,	800,	500,	0,	240,	240,	1),
           (2,	1,	300,	100,	0,	240,	240,	3),
           (2,	1,	400,	300,	0,	240,	240,	2),
           (1,	2,	1200,	700,	0,	240,	240,	1);
          

  


# Teszt adatok --- END ---

# Lekérdezések
  SELECT * FROM jatekosok;
  SELECT * FROM baratok;
  SELECT * FROM jatszmak;

  # Játékos keresés
  SELECT id, felhasznalonev FROM jatekosok WHERE felhasznalonev LIKE '';

  # Barátok
  SELECT j.felhasznalonev FROM baratok b
    INNER JOIN jatekosok j ON j.id = b.jatekos2_id
    WHERE b.jatekos1_id = 1 OR b.jatekos2_id = 1;

  # Rangsor Pontszam
  SET @jatekos := 2;
  SELECT SUM(tbl.pont) as 'Rangsor pontszám' FROM
                      (SELECT (jatekos1_pont - jatekos2_pont) as pont FROM jatszmak
                        WHERE jatekos1_id = @jatekos
                      UNION
                      SELECT (jatekos2_pont - jatekos1_pont) as pont FROM jatszmak
                        WHERE jatekos2_id = @jatekos) as tbl;

  # Legutobbi 10 jatszma
  SELECT * FROM jatszmak
    WHERE jatekos1_id = 1 or jatekos2_id = 1
    LIMIT 10;
    

  # Bejelentkezés
    SELECT * FROM jatekosok
     WHERE felhasznalonev = 'value';

# Insert
  # Regsztráció
  INSERT INTO jatekosok (felhasznalonev, jelszo)
    VALUE ('value1', 'value2');

  # Új játszma
  INSERT INTO jatszmak (jatekos1_id, jatekos2_id, jatekos1_pont, jatekos2_pont, allapot, jatekido, maxido, nehezseg)
    VALUE ('value1', 'value2', 0, 0, 1, 0, 'value3', 'value4');
  CREATE TABLE match3.jatszma_id (
     X INT(11) NOT NULL,
     Y INT(11) NOT NULL,
     csempe_id INT(11) NOT NULL
  );

  # Barátnak jelölés
    INSERT INTO baratok (jatekos1_id, jatekos2_id)
      VALUE (1, 2);

# Update
  # Felhasználónév változtatás
  UPDATE jatekosok SET
    felhasznalonev = 'value'
    WHERE id = 'value';

  # Jelszó változtatás
  UPDATE jatekosok SET
    jelszo = 'value'
    WHERE id = 'value';

  # Fiók törlés
  UPDATE jatekosok SET
    felhasznalonev = 'Törölt felhasználó', jelszo = null
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