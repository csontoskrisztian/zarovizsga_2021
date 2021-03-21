# Match 3

## Weboldal leírása:
- A felhasználó létrehozhat egy fiókot, bejelentkezhet utána. Törölheti is a fiókját.
- Rákereshet más felhasználókra és barátnak jelölheti azokat.
- Játszhat idegenekkel vagy barátokkal.
- Az alapján, hogy győzőtt vagy vesztett, kapni fog egy bizonyos pontszámot.
- A felhasználókat a pontszámaik alapján pedig rangsoroljuk.

## Játék leírása:
- A játék 5 körből áll
- A két játékosnak 2-2 lépése van egy körön belül
- És a játékosnak a 2 lépésre 1 perce van
- A cél, hogy a 8x8-as táblán minél több 3-as, 4-es és 5-ös párt alkossanak, így pontokat szerezve
  - Pontszám += elemek száma a párban
  - 4-es pár esetén létrehoz egy speciális elemet, amit ha párba raknak eltörli azt a sort/oszlopot (+8 pont)
  - 5-ös pár esetén létrehoz egy speciális elemet, amit ha párba raknak, akkor egy robbanással eltöröl 13 elemet egy gyámánt formában (+13 pont)
  - Ha párban lévő elemek száma nagyobb, mint 3, akkor a játékos kap egy extra kört
- Ha letelt az 5 kör, akkor az nyer, akinek a legtöbb pontja van
- A két játékos pontszám különbsége alapján a nyertes feljebb, míg a vesztes lejjebb megy a ranglétrán

## Adatbázis:
### Játékosok tábla:
    - ID
    - Felhasználónév
    - Jelszó
    - Barátok: [játékos1_id, játékos2_id]

### Barátok tábla:
    - Játékos1_id
    - Játékos2_id
 
### Játszma_*RandomGeneráltID* tábla:
    - X
    - Y
    - csempe_id
    - JátszmaId

### Játszmák
    - JátszmaId
    - Játékos1_id
    - Játékos2_id
    - Játékos1_pont: +1
    - Játékos2_pont: 0
    - Állapot: folyamatban, vége
    - Játékidő
    - Maxidő
    - Nehézség

### Csempék tábla:
    - csempe_id
    - csempe_ikon
