# Játék:
- [x] Tile ikonok lecserélése
- [x] Tile pozíciójának folyamatos újraszámolása
- [x] Generálás adatbázisból
- [x] Ismétlődés nélküli véletlen generátor
- [x] Generálásnál vegye figyelembe a nehézségi szintet
    - könnyű - 6
    - normál - 8
    - nehéz - 10
- [x] Animáció mikor legenerálódott a tábla
- [x] Párok felismerése
- [x] Lehetséges párok felismerése
- [x] Lehetséges pároknál ne vegye figyelembe az ismétlődést
- ~~[ ] Pár másodperc inaktivítás után jelezzen egy random lehetséges párt (animáció)~~
- [x] Újrarendezés, ha nincs pár
- ~~[ ] Újrarendezés animálás (Shuffle függvény probléma)~~
- [x] Ha egyszerre többször próbáljuk meg animálni egy elem adott tulajdonságát, akkor várja meg, míg első befejeződőtt és csak akkor kezdje a következőt
- [x] Párok törlése
- [x] Zuhanás
- [x] Üres helyek feltöltése
- [x] Animációk (külön osztály?) -> animációk alatt nem fogad semmi bemenetet a canvas
- [x] Animációk beszúrása (csere, csere-vissza, zuhanás)
- ~~[ ] Boostok (?????)~~
    - ~~[ ] 4 pár -> sor/oszlop törlő~~
    - ~~[ ] 5 pár -> robbanás~~
    - ~~[ ] 5< pár -> egész tábla törlése~~
    - ~~Nehéz szinten 5 -> sor/oszlop törlő és 5< -> robbanás~~
- [x] Pont számítás (3 tile = 100 pont, 4 - 200, 5 - 300, 5< - 1000)
- [x] Időzítő
- ~~[ ] 2 lépés / kör (3< pár -> +1 lépés)~~
- [x] 2 személyessé tétel
    - [x] Időzítő indítás -> MySQL Event vagy helyileg az éppen kor-ben lévő játékos frissíti
    - [x] Csak akkor tud a játékos mozogni, ha az ő köre van
    - [x] A 'kor'-ben levő játkos lépése esetén insert jatszmaLepesek
    - [x] A nem 'kor'-ben lévő folyamatosan figyeli a jatszmaLepesek tablat (where jatszmaId = id) -> Ha talál valamit, akkor módosítja a selected tile-eket és AfterMath()
    - [x] Minden párosításnál frissítjük a pontokat
    - [x] Ha megvoltak a lépések, akkor a másik játékos jön
    - [x] Ha az időzítő lejár a játék befejeződik -> update jatszmak
    - [x] Körváltásnál nem a megfelelő játékos kap pontot
    - [x] Körváltásnál updateJatszmak
    - [x] Néha összezavarodik (???)
        - Meghívja az insertJatszmaLepesek-et és utána a getJatszmaLepesek-et, mikor csak az utóbbit kéne
        - A lépések száma csökken egyet
        - Emiatt azt hiszi, hogy nem az ő köre van, mikor még igen
        - Sikerült eljutnom 10100-ig pntszámban és nem jött elő a hiba újra
        - kinek a lépése bevezetése
    - ~~[ ] Körváltáskor értesítés, hogy ki jön~~
- ~~[ ] kor kivétele a Jatszmak táblából (???)~~

# Weboldal: 
- [x] Csináld meg a főoldalt!
- ~~[ ] Felesleges GetUser kérések törlése, csak várjuk meg, míg betölt az oldal teljesen~~
- ~~[ ] Alert üzenetek lecserélése Modal-ra~~
- [x] Profil szerkesztése (e-mail, profilkép)
- [ ] Más profiljának megtekintése
- [x] Profilképek
- [x] Profil törlése
- [ ] Auto kijelentkezés
- [x] Weboldal dizájn
- [x] Bizonyos oldalak való hozzáférés megakadályozása 
- ~~[ ] Notifikáció rendszer (????)~~
- ~~[ ] Játkos meghívása játékra~~
- ~~[ ] Játékos "online" mezőjének átnevezése "allapot"-ra~~
    - online
    - offline
    - inGame
- ~~[ ] Ha játékban vagyunk a weboldal figyelmeztessen, ha elakarjuk hagyni az oldalt~~
- [x] Új játék indítás
    - Adatok begyűjtése
    - jatszmak insert -> megkapjuk az id-t
    - Felhasználó várakoztatás
        - Tábla legenárálása
        - Várakozás a 2. játékosra (timeout 1 perc)
    - Elindul a játék
- [x] Nem csatlakozik senki a játékhoz
    - jatszmak delete (Ne tároljunk felesleges adatot)
- [x] Csatlakozás meglévő játékhoz
    - Keresés (where jatekos2_id = null && allapot = 1) -> Ha nincs játék folyamatban közöljük
        - Megkapjuk az id-t
        - jatszmak update (jatekos2_id = felhasználó id)
        - Tábla generálás seed alapján
    - Elindul a játék
- ~~[ ] Szűrő a "Csatlakozás meglévő játékhoz" részhez~~
    - ~~'-' (Mindegy) kezelése~~
- [x] Game Over mutatása miután befejeződött a játék
    - Zöld ha nyert a felhasználó
    - Sárga ha döntetlen
    - Piros ha vesztett a felhasználó
    - Mutatja mennyi pontot nyert/vesztett
    - Gombok: Főmenű és Új játék (Oldal frissítése)
- ~~[ ] Függvények kiszortírozása~~