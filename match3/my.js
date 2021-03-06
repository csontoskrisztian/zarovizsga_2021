export class Match3 {
    constructor(table, images, data, player_id) {
        this.table = table;
        this.images = images;
        this.data = data;
        this.player_id = player_id;
        this.seed = data.seed;
        this.difficulty = data.nehezseg;

        this.debug = false;

        Init(this);
    }
}

class Tile {
    constructor(type, src, size, col, row) {
        this.type = type;
        this.img = src
        this.img.width = size;
        this.img.height = size;
        this.size = size;
        this.col = col;
        this.row = row;
        this.visible = true;
        this.isInPair = false;
    }

    getX() {
        return this.col * this.size;
    };
    getY() {
        return this.row * this.size;
    };

    // Benne van-e a megadott pont a Tile területén belül
    isPositionMacthing(x, y) {
        return x >= this.getX() && x <= this.getX() + this.size && y >= this.getY() && y <= this.getY() + this.size;
    }

    // Szomszédos-e a megadott Tile-el
    areNeighboursWith(tile) {
        return Math.abs(this.col - tile.col) == 1 && Math.abs(this.row - tile.row) == 0 ||
            Math.abs(this.col - tile.col) == 0 && Math.abs(this.row - tile.row) == 1;
    }
}

class Animation {
    constructor(target, property, value, duration, promise = function () {}, delay = 0) {
        this.target = target;
        this.property = property;
        this.value = value;
        this.distance = this.target[this.property] - this.value;
        this.duration = duration;
        this.promise = promise;
        this.delay = delay;

        this.time = 0;
    }
}

class Pair {
    constructor(tiles_array) {
        this.tiles = tiles_array;
        this.length = tiles_array.length;
    }
}

var Random = (function () {

    // --- HASZNÁLAT ---
    // var r = new Random();
    // var nextInt = r.Next(1, 100); //returns an integer between range
    // var nextDbl = r.NextDouble(); //returns a random decimal

    function Random(Seed) {
        if (!Seed) {
            Seed = this.milliseconds();
        }
        this.SeedArray = [];
        for (var i = 0; i < 56; i++)
            this.SeedArray.push(0);
        var num = (Seed == -2147483648) ? 2147483647 : Math.abs(Seed);
        var num2 = 161803398 - num;
        this.SeedArray[55] = num2;
        var num3 = 1;
        for (var i_1 = 1; i_1 < 55; i_1++) {
            var num4 = 21 * i_1 % 55;
            this.SeedArray[num4] = num3;
            num3 = num2 - num3;
            if (num3 < 0) {
                num3 += 2147483647;
            }
            num2 = this.SeedArray[num4];
        }
        for (var j = 1; j < 5; j++) {
            for (var k = 1; k < 56; k++) {
                this.SeedArray[k] -= this.SeedArray[1 + (k + 30) % 55];
                if (this.SeedArray[k] < 0) {
                    this.SeedArray[k] += 2147483647;
                }
            }
        }
        this.inext = 0;
        this.inextp = 21;
        Seed = 1;
    }
    Random.prototype.milliseconds = function () {
        var str = new Date().valueOf().toString();
        return parseInt(str.substr(str.length - 6));
    };
    Random.prototype.InternalSample = function () {
        var num = this.inext;
        var num2 = this.inextp;
        if (++num >= 56) {
            num = 1;
        }
        if (++num2 >= 56) {
            num2 = 1;
        }
        var num3 = this.SeedArray[num] - this.SeedArray[num2];
        if (num3 == 2147483647) {
            num3--;
        }
        if (num3 < 0) {
            num3 += 2147483647;
        }
        this.SeedArray[num] = num3;
        this.inext = num;
        this.inextp = num2;
        return num3;
    };
    Random.prototype.Sample = function () {
        return this.InternalSample() * 4.6566128752457969E-10;
    };
    Random.prototype.GetSampleForLargeRange = function () {
        var num = this.InternalSample();
        var flag = this.InternalSample() % 2 == 0;
        if (flag) {
            num = -num;
        }
        var num2 = num;
        num2 += 2147483646.0;
        return num2 / 4294967293.0;
    };
    Random.prototype.Next = function (minValue, maxValue) {
        if (!minValue && !maxValue)
            return this.InternalSample();
        var num = maxValue - minValue;
        if (num <= 2147483647) {
            return parseInt((this.Sample() * num + minValue).toFixed(0));
        }
        return this.GetSampleForLargeRange() * num + minValue;
    };
    Random.prototype.NextDouble = function () {
        return this.Sample();
    };
    Random.prototype.NextBytes = function (buffer) {
        for (var i = 0; i < buffer.length; i++) {
            buffer[i] = this.InternalSample() % 256;
        }
    };
    return Random;
}());

function Render(self) {
    // Canvas letisztítása minden rajzolás előtt
    self.tableC.clearRect(0, 0, self.table.width, self.table.height);

    // Háttér
    self.tableC.fillStyle = "#e0d6f2";
    self.tableC.fillRect(0, 0, self.table.width, self.table.height)

    self.tiles.forEach(tile => {
        // Csak akkor rajzoljuk fel, ha látható
        if (tile != null && tile.visible) {

            // Ellenőrzés: Ha a tile ki van választva
            if (tile == self.selectedTile_1 || tile == self.selectedTile_2) {
                // Rajzolja meg a képet
                self.tableC.drawImage(tile.img, tile.getX(), tile.getY(), tile.size, tile.size);

                // Összetett operátor típusa = duplikálás (felső pixel színe * alsó pixel színe)
                self.tableC.globalCompositeOperation = "multiply";

                // Kiválasztás színe és felrajzolása
                self.tableC.fillStyle = "#e0d6f2";
                self.tableC.fillRect(tile.getX(), tile.getY(), tile.size, tile.size);

                // Összetett operátor visszaállítása
                self.tableC.globalCompositeOperation = "source-over";
            } else {
                self.tableC.drawImage(tile.img, tile.getX(), tile.getY(), tile.size, tile.size);
            }
        }
    });
}

function Update(self, dt) {
    // console.log(dt);

    let alreadyAnimated = [];

    self.Animations.filter((animation, index) => {
        let checkObj = alreadyAnimated.find(obj => obj.target == animation.target && obj.property == animation.property);
        if (checkObj) {
            // Távolság frissítése azoknál az animációknál, amik még nem futhatnak le
            // animation.distance = checkObj.value - animation.value;
            animation.distance = animation.target[animation.property] - animation.value;
            // console.log(animation.distance);
            // console.log(alreadyAnimated.length);

            return;
        };

        // Animáció késleltetése
        if (animation.delay > 0) {
            animation.delay -= dt;

            if (animation.delay <= 0) {
                animation.delay = 0;
            } else {
                return;
            }
        }

        // Tényleg 5mp telt el?
        animation.time += dt;

        // SEBESSÉG kiszámolása: v = s/t -> távolság/idő
        let formula;
        if (animation.duration > 0 && Math.abs(animation.distance) > 0) {
            formula = (animation.distance / animation.duration) * dt;
        } else {
            formula = animation.distance
        }
        // console.log("Formula: " + formula);


        if (animation.time > animation.duration + 0.01) {
            // FAILSAFE
            // console.log("--- ANIMATION FAILSAFE ---");
            // console.log(animation);

            animation.target[animation.property] = animation.value;
            animation.time = Math.round((animation.time + Number.EPSILON) * 1000) / 1000;

            alreadyAnimated.push({
                animation
            });

            // console.log("Idő: " + animation.time + " mp");
            // console.log("Érték: " + animation.target[animation.property]);

            let promise = animation.promise;

            self.Animations.splice(index, 1);

            promise();
        } else if (Math.round(animation.target[animation.property] - 0.49) != animation.value ||
            Math.round(animation.target[animation.property] + 0.49) != animation.value) {
            animation.target[animation.property] -= formula;
            // console.log("Property: " + animation.target[animation.property]);

            alreadyAnimated.push({
                index: index,
                target: animation.target,
                property: animation.property,
                value: animation.value
            });
        } else {
            // console.log("--- ANIMATION END ---");
            animation.target[animation.property] = Math.round(animation.target[animation.property]);
            animation.time = Math.round((animation.time + Number.EPSILON) * 1000) / 1000;

            alreadyAnimated.push({
                index: index,
                target: animation.target,
                property: animation.property,
                value: animation.value
            });

            // console.log("Idő: " + animation.time + " mp");
            // console.log("Érték: " + animation.target[animation.property]);

            let promise = animation.promise;

            self.Animations.splice(index, 1);

            promise();
        }
    });
}

function Init(self) {
    // Random példányosítás
    self.r = new Random(self.seed);

    // Animációkat tartalmazó tömb
    self.Animations = [];

    // x y pozíció
    self.cursorX = 0;
    self.cursorY = 0;
    // Az egér relatív pozíciója
    self.table.onmousemove = function (e) {
        let parentOffset = e.currentTarget.getBoundingClientRect();
        self.cursorX = e.clientX - parentOffset.left;
        self.cursorY = e.clientY - parentOffset.top;
    }

    self.table.onclick = function () {
        // Ha animáció játszodik le, akkor le van tíltva az input
        if (self.Animations.length > 0) return;

        // Ha nem a mi körünk van, akkor le van tíltva az input
        if (self.data.kor != self.player_id) return;

        // console.log("Kattintás!");
        // console.log(self.OnClickListeners);

        // Kattintásra kijelölünk és ellenőrzünk
        SelectTile(self);
    }

    // Canvas 2d contextus
    self.tableC = self.table.getContext('2d');

    // Hányszor hanyas csempékből álljon
    self.tableSize = 8;
    // Mekkorák legyenek a csempék
    self.tileSize = self.table.width / self.tableSize;

    self.tiles = [];
    // Tiles tömb létrehozása és feltöltése random csempékkel
    // Ha esetleg nem lenne benne egy pár sem, akkor újrageneráljuk
    let failsafe = 0;
    do {
        if (failsafe == 100) break;
        self.tiles = [];
        RandomTilesGenerator(self);
        failsafe++;
    } while (FindPossibleMoves(self).length == 0);

    // Egyetlen egy tile középen animáció teszthez
    // self.tiles.push(GetRandomTile(self, 3, 3));

    // Miután legenárltuk a táblát leanimáljuk a kezdő zuhanást
    let animation_time = 1.25;
    for (let i = 0; i < self.tiles.length; i++) {
        const tile = self.tiles[i];

        let tile_y = tile.row;
        tile.row = tile.row - 8;

        self.Animations.push(new Animation(tile, "row", tile_y, animation_time));

        animation_time -= 0.01
    }

    // Animáció teszt (csoportos animáció, delay)
    // self.Animations.push(new Animation(self.tiles[0], "row", 0, animation_time, function() {Shuffle(self)}));

    // console.log(self.tiles);

    self.selectedTile_1 = null;
    self.selectedTile_2 = null;

    // Lépés számláló
    self.round = 2;

    // Ha lép az ellenfél, azt jelenítsük meg a mi táblánkon is
    self.OnOpponentMove = function (selected1_X, selected1_Y, selected2_X, selected2_Y) {
        OpponentMove(self, selected1_X, selected1_Y, selected2_X, selected2_Y);

        // Körszámláló
        RoundCounter(self);
    };

    // Körszámláló
    self.OnInsert = function () {
        RoundCounter(self);
    };

    // Folyamatos frissítés
    let lastUpdate = Date.now();
    self.interval = setInterval(tick, 0);

    function tick() {
        let now = Date.now();
        let dt = (now - lastUpdate) / 1000;
        lastUpdate = now;

        Update(self, dt);
        Render(self);
    };

    // Object törlése
    self.Destroy = function () {
        clearInterval(self.interval);
        self = null;
    }
}

function GetRandomTile(self, x, y) {
    let max = self.difficulty == 3 ? 9 : self.difficulty == 2 ? 7 : 5;
    let rType = self.r.Next(0, max);

    return new Tile(rType, self.images[rType], self.tileSize, x, y);
}

function RandomTilesGenerator(self) {
    // Előző előtti és előző csempe x tengelyen
    let secondLastTileType_X;
    let firstLastTileType_X;
    // Előző előtti és előző csempe y tengelyen
    let secondLastTileType_Y;
    let firstLastTileType_Y;
    // Jelenlegi csempe
    let currentTile;

    for (let y = 0; y < self.tableSize; y++) {
        for (let x = 0; x < self.tableSize; x++) {
            if (x > 0) {
                firstLastTileType_X = self.tiles.find(tile => tile.row == y && tile.col == x - 1).type;
                // console.log("X", x, y, firstLastTileType_X);
            }
            if (x > 1) {
                secondLastTileType_X = self.tiles.find(tile => tile.row == y && tile.col == x - 2).type;
                // console.log("X", x, y, secondLastTileType_X);
            }
            if (y > 0) {
                firstLastTileType_Y = self.tiles.find(tile => tile.row == y - 1 && tile.col == x).type;
                // console.log("Y", x, y, firstLastTileType_Y);
            }
            if (y > 1) {
                secondLastTileType_Y = self.tiles.find(tile => tile.row == y - 2 && tile.col == x).type;
                // console.log("Y", x, y, secondLastTileType_Y);
            }

            // legenerálunk egy random csempét, figyelünk arra, hogy ne alakuljon ki 3-as pár
            do {
                currentTile = GetRandomTile(self, x, y);
            } while (
                // Ha az előző kettő az X tengelyen ugyan olyan 
                (firstLastTileType_X == secondLastTileType_X && secondLastTileType_X == currentTile.type) ||
                // Ha az előző kettő az Y tengelyen ugyan olyan
                (firstLastTileType_Y == secondLastTileType_Y && secondLastTileType_Y == currentTile.type)
            );

            self.tiles.push(currentTile);
        }
    }
}

function TileFromSourceGenerator(self) {
    self.data.forEach(d => {
        self.tiles.push(new Tile(d.csempe_id, self.images[d.csempe_id], self.tileSize, d.X, d.Y));
    });
}

function OpponentMove(self, selected1_X, selected1_Y, selected2_X, selected2_Y) {
    // console.log(selected1_X, selected1_Y, selected2_X, selected2_Y);
    self.selectedTile_1 = self.tiles.find(tile => tile.col == selected1_X && tile.row == selected1_Y);
    self.selectedTile_2 = self.tiles.find(tile => tile.col == selected2_X && tile.row == selected2_Y);
    // console.log(self.selectedTile_1, self.selectedTile_2);

    if (self.debug) console.log("Csere!");
    SwitchTiles(self, self.selectedTile_1, self.selectedTile_2, true, function () {
        AfterMath(self);
    });
}

function RoundCounter(self) {
    // Lépésszámlálóból kivonunk egyet
    self.round -= 1;
    // Ellenőrzés: Ha leteltek a lépések, akkor a másik játékos jön
    if (self.round == 0) {
        self.data.kor = self.data.kor == self.data.jatekos1_id ? self.data.jatekos2_id : self.data.jatekos1_id;
        console.log("Kinek a köre: " + self.data.kor);

        self.OnRoundChange();

        self.round = 2;
    }

    console.log("Maradék lépések száma: " + self.round);
}

function SelectTile(self) {
    // Egy tile kijelölése
    self.tiles.forEach(tile => {
        if (tile.isPositionMacthing(self.cursorX, self.cursorY)) {

            if (!self.selectedTile_1) {
                // Ha nincs semmi kijelölve, jelölje ki
                self.selectedTile_1 = tile;
            } else if (self.selectedTile_1 == tile) {
                // Ha ki van már jelölve, szüntesse meg a kijelölést
                self.selectedTile_1 = null;
            } else if (!self.selectedTile_2 && self.selectedTile_1.areNeighboursWith(tile)) {
                // Ha szomszédok az első kijelöléssel, akkor jelölje ki másodikként
                self.selectedTile_2 = tile;
            } else {
                // Ha nincs az első kijelölése közvetlen közelében, akkor legyen ez az első kijelölés
                self.selectedTile_1 = tile;
            }

            return;
        };
    });

    // Ha 2 tile ki van jelölve, akkor cserélje meg őket
    if (self.selectedTile_1 && self.selectedTile_2) {
        if (self.debug) console.log("Csere!");

        // Páralkotáskor elindítjuk a függvényt, ami frissíti az adatbázist
        self.OnPair(self.selectedTile_1.col, self.selectedTile_1.row, self.selectedTile_2.col, self.selectedTile_2.row);

        // Két kijelölt elem felcserélse
        SwitchTiles(self, self.selectedTile_1, self.selectedTile_2, true, function () {
            AfterMath(self); // Következmények
        });
    }
}

function MatchFounder(self, tilesArray) {
    let foundMatches = [];

    // Párok soronként (x tengely)
    // console.log("SORONKÉNT");
    for (let y = 0; y < self.tableSize; y++) {
        // Megkeressük a sor első csempéjét
        let tArray = [tilesArray.find(tile => tile.row == y && tile.col == 0)];
        for (let x = 1; x < self.tableSize; x++) {
            // Jelenleg vizsgált csempe
            let currentTile = tilesArray.find(tile => tile.row == y && tile.col == x)
            // console.log(currentTile, y, x);
            // Ha láthatatlan, akkor kihagyjuk
            if (!currentTile.visible) continue;

            if (tArray[0].type == currentTile.type) {
                // Ha megegyezik a típusuk, belerakjuk az ideiglenes tömbe
                tArray.push(currentTile);
            } else {
                // Ha nem egyezik meg, akkor ellenőrízzük az ideiglenes tömb nagyságát
                if (tArray.length >= 3) {
                    // És ha 3-nál nagyobb, akkor belerakjuk a talált párok közé
                    for (let t = 0; t < tArray.length; t++) {
                        tArray[t].isInPair = true;
                    }
                    foundMatches.push(new Pair(tArray));
                }

                // Majd áttérünk a következő új típusra
                tArray = [currentTile];
            }
        }

        // Mielőtt tovább mennénk a következő sorba, szintén lellenőrizzük van-e pár
        if (tArray.length >= 3) {
            // És ha 3-nál nagyobb, akkor belerakjuk a talált párok közé
            for (let t = 0; t < tArray.length; t++) {
                tArray[t].isInPair = true;
            }
            foundMatches.push(new Pair(tArray));
        }
    }

    // Párok oszloponként (y tengely)
    // console.log("OSZLOPONKÉNT");
    for (let x = 0; x < self.tableSize; x++) {
        // Megkeressük az oszlop első csempéjét
        let tArray = [tilesArray.find(tile => tile.row == 0 && tile.col == x)];
        for (let y = 1; y < self.tableSize; y++) {
            // Jelenleg vizsgált csempe
            let currentTile = tilesArray.find(tile => tile.row == y && tile.col == x)
            // console.log(currentTile);
            // Ha láthatatlan, akkor kihagyjuk
            if (!currentTile.visible) continue;

            if (tArray[0].type == currentTile.type) {
                // Ha megegyezik a típusuk, belerakjuk az ideiglenes tömbe
                tArray.push(currentTile);
            } else {
                // Ha nem egyezik meg, akkor ellenőrízzük az ideiglenes tömb nagyságát
                if (tArray.length >= 3) {
                    // És ha 3-nál nagyobb, akkor belerakjuk a talált párok közé
                    for (let t = 0; t < tArray.length; t++) {
                        tArray[t].isInPair = true;
                    }
                    foundMatches.push(new Pair(tArray));
                }

                // Majd áttérünk a következő új típusra
                tArray = [currentTile];
            }
        }

        // Mielőtt tovább mennénk a következő oszlopba, szintén lellenőrizzük van-e pár
        if (tArray.length >= 3) {
            // És ha 3-nál nagyobb, akkor belerakjuk a talált párok közé
            for (let t = 0; t < tArray.length; t++) {
                tArray[t].isInPair = true;
            }
            foundMatches.push(new Pair(tArray));
        }
    }


    return foundMatches;
}

function AfterMath(self) {
    // Aftermath letíltása, míg animációk folynak
    if (self.Animations.length > 0) return;
    if (self.debug) console.log("Pár keresés!");

    // Talált párok
    let matches = MatchFounder(self, self.tiles);

    if (matches.length > 0) {
        // Ha vannak párok
        if (self.debug) console.log("Párok törlése!")

        // Láthatatlanná teszük a párokat
        matches.forEach(pairs => {
            pairs.tiles.forEach(tile => {
                tile.visible = false;
            });
        });

        // Megszüntetjük a kijelölést
        self.selectedTile_1 = null;
        self.selectedTile_2 = null;

        // Pontozás a párok száma alapján
        matches.forEach(pairs => {
            if (self.data.kor == self.data.jatekos1_id && self.round != 2 || self.data.kor == self.data.jatekos2_id && self.round == 2) {
                if (pairs.tiles.length % 3 == 0) {
                    self.data.jatekos1_pont += 100;
                } else if (pairs.tiles.length % 4 == 0) {
                    self.data.jatekos1_pont += 200;
                } else if (pairs.tiles.length % 5 == 0) {
                    self.data.jatekos1_pont += 300;
                } else {
                    self.data.jatekos1_pont += 1000;
                }
            }
            if (self.data.kor == self.data.jatekos2_id && self.round != 2 || self.data.kor == self.data.jatekos1_id && self.round == 2) {
                if (pairs.tiles.length % 3 == 0) {
                    self.data.jatekos2_pont += 100;
                } else if (pairs.tiles.length % 4 == 0) {
                    self.data.jatekos2_pont += 200;
                } else if (pairs.tiles.length % 5 == 0) {
                    self.data.jatekos2_pont += 300;
                } else {
                    self.data.jatekos2_pont += 1000;
                }
            }
        });

        // Lebegő csempék leesése
        Falldown(self);

    } else if (self.selectedTile_1 && self.selectedTile_2) {
        if (self.debug) console.log("Csere vissza!")
        // Ha kivannak jelölve kockák, de nincsenek párok, akkor visszacseréljük őket

        SwitchTiles(self, self.selectedTile_1, self.selectedTile_2, true);

        // Megszüntetjük a kijelölést
        self.selectedTile_1 = null;
        self.selectedTile_2 = null;

        // HelpFindMatches(self);
    } else {
        // Ha nincsenek párok és nincsen semmi sem kijelölve, akkor megkezdjük a feltöltést
        Refill(self);
    }
}

function Falldown(self) {
    if (self.debug) console.log("Leesés!");

    for (let y = self.tableSize - 1; y >= 1; y--) {
        for (let x = 0; x < self.tableSize; x++) {
            const currentTile = self.tiles.find(tile => tile.row == y && tile.col == x);
            // Ha talált Tile-t a koordináta alapján
            // És a jelenlegi Tile látható, akkor ugorjunk a következő esetre
            if (currentTile && currentTile.visible) continue;

            let i = 1;
            while (i < currentTile.row + 1) {
                // "Amíg az i kisebb, mint a jelenlegi magasság + 1", hogy a (magasság - i) sose legyen kisebb, mint 0

                // Fölötte lévő csempe
                const upperTile = self.tiles.find(tile => tile.row == currentTile.row - i && tile.col == currentTile.col);

                if (upperTile.visible) {
                    // Ha látható a csempe

                    // Adatok eltárolása
                    let tile_1_row = currentTile.row;
                    let tile_2_row = upperTile.row;

                    // Hogy ne avatkozzon közbe a következő láthatatlan csempe, a jelenlegi csempét egyből a helyére tesszük, animáció nélkül
                    // A felső csempét pedig lejjebb visszük 0.1-el
                    // Tehát kihasználjuk, hogy a rendszerünk egész számokat keres
                    // És a következő láthatatlan csempe már nem fogja megtalálni a láthatót, csak a jelenlegi láthatatlant
                    currentTile.row = tile_2_row;
                    upperTile.row += 0.1;

                    // Helycsere meganimálása
                    let animation_time = 0.25;
                    self.Animations.push(
                        new Animation(upperTile, "row", tile_1_row, animation_time, function () {
                            AfterMath(self);
                        })
                    );

                    // Megtaláltuk az első olyan fölötte lévő csempét, ami látható, szóval nem kersünk tovább
                    break;
                }

                i++;
            }
        }
    }

    // Ha nincs mi leessen, akkor nem indul el az AfterMath függvény sem
    // Tehát ha nem fut animáció, akkor manuálisan kell elindítani, hogy feltöltsük az üres helyeket
    if (self.Animations.length == 0) AfterMath(self);
}

function Refill(self) {
    if (self.debug) console.log("Feltöltés!")

    let animation_time = 0.25; // Animáció hossza
    let negative = -1; // Mennyire fent helyezzük el a Tile-t
    let checkforpairs = true; // Keressen-e párokat

    for (let y = self.tableSize - 1; y >= 0; y--) { // Végig  megyünk a sorokon
        if (self.tiles.find(tile => tile.row == y && !tile.visible)) {
            // Ha ebben a sorban van láthatatlan Tile (tehát egy pár része a Tile)
            checkforpairs = false; //Találtunk párt
            negative -= 1; // A köbetkező sor láthatatlan Tile-jei eggyel feljebb mennek
            animation_time += 0.1; // Animáció idő növelése
        } else continue; // Ha nincs ebben a sorban "üres hely", menjen a következőre
        for (let x = 0; x < self.tableSize; x++) { // Végig megyünk a sor elemein
            const currentTile = self.tiles.find(tile => tile.row == y && tile.col == x);
            if (currentTile.visible) continue; // Ha látható a Tile, menjen a követketőre

            // Adatok eltárolása
            let originalY = currentTile.row;
            let newY = negative;

            // Tile újra randomizálása és pozícionálása
            let rTile = GetRandomTile(self, currentTile.col, newY);
            let index = self.tiles.indexOf(currentTile);
            self.tiles[index].row = newY;
            self.tiles[index] = rTile;

            // Leesés animálása
            self.Animations.push(
                new Animation(self.tiles[index], "row", originalY, animation_time, function () {
                    AfterMath(self);
                })
            );
        }
    }

    // Ha nem talált üres helyet egyáltalán és nincsenek lehetséges lépések sem, akkor rázzuk fel a táblát
    if (checkforpairs && FindPossibleMoves(self).length == 0) Shuffle(self);
}

function FindPossibleMoves(self) {
    // DeepCopy
    // Az img tulajdonságon kívűl minden mást tökéletesen lemásol
    let copyTiles = JSON.parse(JSON.stringify(self.tiles));
    // console.log(copyTiles == self.tiles);
    // console.log(copyTiles);
    // console.log(self.tiles);

    let possibleMoves = [];

    for (let y = 0; y < self.tableSize; y++) {
        for (let x = 0; x < self.tableSize; x++) {
            const currentTile = copyTiles.find(tile => tile.row == y && tile.col == x);

            // Mozdítható-e lefelé
            if (y < self.tableSize - 1) {
                let neighbourTile = copyTiles.find(tile => tile.col == x && tile.row == y + 1);

                SwitchTiles(self, currentTile, neighbourTile);

                // Ellenőrzés
                let matches = MatchFounder(self, copyTiles);
                // console.log(matches, x, y, x, y + 1);

                if (matches.length > 0 && (possibleMoves.filter(obj => obj.tile_1 == neighbourTile && obj.tile_2 == currentTile).length == 0)) possibleMoves.push({
                    tile_1: currentTile,
                    tile_2: neighbourTile
                });

                SwitchTiles(self, currentTile, neighbourTile);
            }

            // Mozdítható-e felfelé
            if (y > 0) {
                let neighbourTile = copyTiles.find(tile => tile.col == x && tile.row == y - 1);

                SwitchTiles(self, currentTile, neighbourTile);

                // Ellenőrzés
                let matches = MatchFounder(self, copyTiles);
                // console.log(matches, x, y, x, y - 1);

                if (matches.length > 0 && (possibleMoves.filter(obj => obj.tile_1 == neighbourTile && obj.tile_2 == currentTile).length == 0)) possibleMoves.push({
                    tile_1: currentTile,
                    tile_2: neighbourTile
                });

                SwitchTiles(self, currentTile, neighbourTile);
            }

            // Mozdítható-e jobbra
            if (x < self.tableSize - 1) {
                let neighbourTile = copyTiles.find(tile => tile.col == x + 1 && tile.row == y);

                SwitchTiles(self, currentTile, neighbourTile);

                // Ellenőrzés
                let matches = MatchFounder(self, copyTiles);
                // console.log(matches, x, y, x + 1, y);

                if (matches.length > 0 && (possibleMoves.filter(obj => obj.tile_1 == neighbourTile && obj.tile_2 == currentTile).length == 0)) possibleMoves.push({
                    tile_1: currentTile,
                    tile_2: neighbourTile
                });

                SwitchTiles(self, currentTile, neighbourTile);
            }

            // Mozdítható-e balra
            if (x > 0) {
                let neighbourTile = copyTiles.find(tile => tile.col == x - 1 && tile.row == y);

                SwitchTiles(self, currentTile, neighbourTile);

                // Ellenőrzés
                let matches = MatchFounder(self, copyTiles);
                // console.log(matches, x, y, x - 1, y);

                // if (possibleMoves.length > 0) {
                //     console.log(possibleMoves);
                // }

                if (matches.length > 0 && (possibleMoves.filter(obj => obj.tile_1 == neighbourTile && obj.tile_2 == currentTile).length == 0)) possibleMoves.push({
                    tile_1: currentTile,
                    tile_2: neighbourTile
                });

                SwitchTiles(self, currentTile, neighbourTile);
            }
        }
    }

    // CopyTiles csemépk lecserélése az eredetikre
    for (let i = 0; i < possibleMoves.length; i++) {
        const cTile_1 = possibleMoves[i].tile_1;
        const cTile_2 = possibleMoves[i].tile_2;
        const oTile_1 = self.tiles.find(tile => tile.col == cTile_1.col && tile.row == cTile_1.row);
        const oTile_2 = self.tiles.find(tile => tile.col == cTile_2.col && tile.row == cTile_2.row);

        possibleMoves[i].tile_1 = oTile_1;
        possibleMoves[i].tile_2 = oTile_2;
    }

    if (self.debug) console.log(`Lehetséges párok száma: ${possibleMoves.length}`);
    return possibleMoves;
}

function SwitchTiles(self, tile_1, tile_2, animate = false, promise = function () {}, delay = 0) {
    // Adatok eltárolása
    let tile_1_col = tile_1.col,
        tile_1_row = tile_1.row;
    let tile_2_col = tile_2.col,
        tile_2_row = tile_2.row;

    // Csere
    if (animate) {
        let animation_time = 0.35;

        if (tile_1_col == tile_2_col) {
            self.Animations.push(new Animation(
                tile_1, "row", tile_2_row, animation_time, undefined, delay
            ));
            self.Animations.push(new Animation(
                tile_2, "row", tile_1_row, animation_time, promise, delay
            ));
        } else if (tile_1_row == tile_2_row) {
            self.Animations.push(new Animation(
                tile_1, "col", tile_2_col, animation_time, undefined, delay
            ));
            self.Animations.push(new Animation(
                tile_2, "col", tile_1_col, animation_time, promise, delay
            ));
        }
    } else {
        tile_1.col = tile_2_col;
        tile_1.row = tile_2_row;
        tile_2.col = tile_1_col;
        tile_2.row = tile_1_row;
    }
}

function Shuffle(self) {
    if (self.Animations.length > 0) return;
    if (self.debug) console.log("Felrázás!");

    // Előző előtti és előző csempe x tengelyen
    let secondLastTileType_X;
    let firstLastTileType_X;
    // Előző előtti és előző csempe y tengelyen
    let secondLastTileType_Y;
    let firstLastTileType_Y;
    // Random index
    let randomIndex;

    for (let y = 0; y < self.tableSize; y++) {
        for (let x = 0; x < self.tableSize; x++) {
            const currentTile = self.tiles.find(tile => tile.row == y && tile.col == x);
            if (currentTile == undefined) {
                console.log("!!!UNDEFINED!!!")
                console.log(y, x);
                console.log("!!!UNDEFINED!!!")
            }

            if (x > 0) {
                firstLastTileType_X = self.tiles.find(tile => tile.row == y && tile.col == x - 1).type;
                // console.log("X", x, y, firstLastTileType_X);
            }
            if (x > 1) {
                secondLastTileType_X = self.tiles.find(tile => tile.row == y && tile.col == x - 2).type;
                // console.log("X", x, y, secondLastTileType_X);
            }
            if (y > 0) {
                firstLastTileType_Y = self.tiles.find(tile => tile.row == y - 1 && tile.col == x).type;
                // console.log("Y", x, y, firstLastTileType_Y);
            }
            if (y > 1) {
                secondLastTileType_Y = self.tiles.find(tile => tile.row == y - 2 && tile.col == x).type;
                // console.log("Y", x, y, secondLastTileType_Y);
            }

            // Legenerálunk egy random indexet, figyelünk arra, hogy ne alakuljon ki 3-as pár
            do {
                randomIndex = self.r.Next(0, self.tiles.length - 1);
                // console.log(randomIndex);
            } while (
                // Ha az előző kettő az X tengelyen ugyan olyan 
                (firstLastTileType_X == secondLastTileType_X && secondLastTileType_X == self.tiles[randomIndex].type) ||
                // Ha az előző kettő az Y tengelyen ugyan olyan
                (firstLastTileType_Y == secondLastTileType_Y && secondLastTileType_Y == self.tiles[randomIndex].type)
            );

            SwitchTiles(self, currentTile, self.tiles[randomIndex], false);
        }
    }

    AfterMath(self);
}

function HelpFindMatches(self) {
    self.helpTimer = setTimeout(function () {
        let pMoves = FindPossibleMoves(self);
        let randomIndex = self.r.Next(0, pMoves.length - 1);
        let rObject = pMoves[randomIndex];

        console.log(randomIndex, rObject);

        let tile_1_col = rObject.tile_1.col,
            tile_1_row = rObject.tile_1.row;
        let tile_2_col = rObject.tile_2.col,
            tile_2_row = rObject.tile_2.row;

        SwitchTiles(self, rObject.tile_1, rObject.tile_2, true, function () {
            console.log("1");
            SwitchTiles(self, rObject.tile_1, rObject.tile_2, true, function () {
                console.log("2");
            });
        });
    }, 5000);
}