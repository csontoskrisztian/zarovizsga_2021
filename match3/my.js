export class Match3 {
    constructor(table, images, seed) {
        this.table = table;
        this.images = images;
        console.log(this.images);
        this.seed = seed;

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

    // Benne van e a megadott pont a Tile területében
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
    constructor(target, property, value, duration, promise = function () {}) {
        this.target = target;
        this.property = property;
        this.value = value;
        this.distance = this.target[this.property] - this.value;
        this.duration = duration;
        this.promise = promise;

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
    self.tableC.fillStyle = "#b3b3b3";
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
                self.tableC.fillStyle = "#b3b3b3";
                self.tableC.fillRect(tile.getX(), tile.getY(), tile.size, tile.size);

                // Visszaállítás
                self.tableC.globalCompositeOperation = "source-over";
            } else {
                self.tableC.drawImage(tile.img, tile.getX(), tile.getY(), tile.size, tile.size);
            }
        }
    });
}

function Update(self, dt) {
    // console.log(dt);

    self.Animations.forEach((animation, index) => {
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


        if (animation.time > animation.duration + 0.001) {
            // FAILSAFE
            // console.log("--- ANIMATION FAILSAFE ---");
            // console.log(animation);

            animation.target[animation.property] = animation.value;
            animation.time = Math.round((animation.time + Number.EPSILON) * 1000) / 1000;

            console.log("Idő: " + animation.time + " mp");
            console.log("Érték: " + animation.target[animation.property]);

            let promise = animation.promise;

            self.Animations.splice(index, 1);

            promise();
        } else if (Math.round(animation.target[animation.property] - 0.49) != animation.value ||
            Math.round(animation.target[animation.property] + 0.49) != animation.value) {
            animation.target[animation.property] -= formula;
            // console.log("Property: " + animation.target[animation.property]);
        } else {
            // console.log("--- ANIMATION END ---");
            animation.target[animation.property] = Math.round(animation.target[animation.property]);
            animation.time = Math.round((animation.time + Number.EPSILON) * 1000) / 1000;

            console.log("Idő: " + animation.time + " mp");
            console.log("Érték: " + animation.target[animation.property]);

            let promise = animation.promise;

            self.Animations.splice(index, 1);

            promise();
        }
    });
}

function Init(self) {
    // // Random seed egyformasági kísérlet
    // let r1 = new Random();
    // let r2 = new Random();
    // for (let i = 0; i < 5; i++) {
    //     console.log(r1.Next(1, 100));
    //     console.log(r2.Next(1, 100));
    //     console.log("-----")
    // }

    // Random példányosítás
    self.r = new Random(self.seed);

    // Animációkat tartalmazó tömb
    self.Animations = [];

    // Kattintásra lefutó függvények tömbje
    self.OnClickListeners = [];

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

        // console.log("Kattintás!");
        // console.log(self.OnClickListeners);

        self.OnClickListeners.forEach(element => {
            element(self);
        });
    }

    // Canvas 2d contectus
    self.tableC = self.table.getContext('2d');

    // Hányszor hanyas csempékből álljon
    self.tableSize = 8;
    // Mekkorák legyenek a csempék
    self.tileSize = 50;

    self.tiles = [];
    // Tiles tömb létrehozása és feltöltése random csempékkel
    // console.log("Majd itt jön a random tábla generálás!");
    RandomTilesGenerator(self)

    console.log(self.tiles);

    self.selectedTile_1 = null;
    self.selectedTile_2 = null;

    // Kattintásra kijelölünk
    self.OnClickListeners.push(SelectTile);
    // Majd megnézzük miket jelöltünk ki eddig
    self.OnClickListeners.push(CheckSelectedTiles);

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
}

function GetRandomTile(self, x, y) {
    let rType = self.r.Next(0, self.images.length - 1);

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

function SelectTile(self) {
    // Egy tile kijelölése

    self.tiles.forEach(tile => {
        if (tile.isPositionMacthing(self.cursorX, self.cursorY)) {
            // console.log(tile.type);

            if (self.selectedTile_1 == null) {
                // Ha nincs semmi kijelölve, jelölje ki
                self.selectedTile_1 = tile;
            } else if (self.selectedTile_1 == tile) {
                // Ha ki van már jelölve, szüntesse meg
                self.selectedTile_1 = null;
            } else if (self.selectedTile_2 == null && self.selectedTile_1.areNeighboursWith(tile)) {
                // Ha szomszédok az első kijelöléssel, akkor jelölje ki
                self.selectedTile_2 = tile;
            } else {
                // Ha nincs az első kijelölése közvetlen közelében, akkor legyen ez az első kijelölés
                self.selectedTile_1 = tile;
            }

            // console.log("Tile 1", self.selectedTile_1);
            // console.log("Tile 2", self.selectedTile_2);
            return;
        };
    });
}

function CheckSelectedTiles(self) {
    // Ha 2 tile ki van jelölve, akkor cserélje meg őket
    if (self.selectedTile_1 != null && self.selectedTile_2 != null) {
        // console.log(self.selectedTile_1.getX(), self.selectedTile_1.getY());
        // console.log(self.selectedTile_2.getX(), self.selectedTile_2.getY());
        console.log("Csere!")

        // Adatok eltárolása
        let tile_1_col = self.selectedTile_1.col,
            tile_1_row = self.selectedTile_1.row;
        let tile_2_col = self.selectedTile_2.col,
            tile_2_row = self.selectedTile_2.row;



        // Animációk (A két kiválasztott tile helyet cserél)
        let animation_time = 0.35;
        if (tile_1_col == tile_2_col) {
            self.Animations.push(
                new Animation(self.selectedTile_1, "row", tile_2_row, animation_time),
                new Animation(self.selectedTile_2, "row", tile_1_row, animation_time, function () {
                    AfterMath(self);
                })
            );
            // console.log(self.selectedTile_1);
            // console.log(self.selectedTile_2);
            // console.log(tile_1_col, tile_1_row);
            // console.log(tile_2_col, tile_2_row);
        } else if (tile_1_row == tile_2_row) {
            self.Animations.push(
                new Animation(self.selectedTile_1, "col", tile_2_col, animation_time),
                new Animation(self.selectedTile_2, "col", tile_1_col, animation_time, function () {
                    AfterMath(self);
                })
            );
            // console.log(self.selectedTile_1);
            // console.log(self.selectedTile_2);
            // console.log(tile_1_col, tile_1_row);
            // console.log(tile_2_col, tile_2_row);
        }
    }
}

function MatchFounder(self) {
    let foundMatches = [];

    // Párok soronként (x tengely)
    // console.log("SORONKÉNT");
    for (let y = 0; y < self.tableSize; y++) {
        // Megkeressük a sor első csempéjét
        let tArray = [self.tiles.find(tile => tile.row == y && tile.col == 0)];
        for (let x = 1; x < self.tableSize; x++) {
            // Jelenleg vizsgált csempe
            let currentTile = self.tiles.find(tile => tile.row == y && tile.col == x)
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
        let tArray = [self.tiles.find(tile => tile.row == 0 && tile.col == x)];
        for (let y = 1; y < self.tableSize; y++) {
            // Jelenleg vizsgált csempe
            let currentTile = self.tiles.find(tile => tile.row == y && tile.col == x)
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

    console.log("Pár keresés!")
    // Array pozíciók felcserélés
    // console.log(self.tiles[tile_1_row][tile_1_col]);
    // self.tiles[tile_1_row][tile_1_col] = self.selectedTile_2;
    // console.log(self.tiles[tile_1_row][tile_1_col]);
    // console.log("---");
    // console.log(self.tiles[tile_2_row][tile_2_col]);
    // self.tiles[tile_2_row][tile_2_col] = self.selectedTile_1;
    // console.log(self.tiles[tile_2_row][tile_2_col]);

    // console.log("Tile 1", self.tiles[tile_1_row][tile_1_col]);
    // console.log("Tile 2", self.tiles[tile_2_row][tile_2_col]);

    // console.log(self.selectedTile_1.getX(), self.selectedTile_1.getY());
    // console.log(self.selectedTile_2.getX(), self.selectedTile_2.getY());

    // Talált párok
    let matches = MatchFounder(self);
    // console.log(matches);
    // return;

    if (matches.length > 0) {
        console.log("Párok törlése!")

        // Láthatatlanná teszük a párokat
        matches.forEach(pairs => {
            pairs.tiles.forEach(tile => {
                tile.visible = false;
            });
        });

        // Megszüntetjük a kijelölést
        self.selectedTile_1 = null;
        self.selectedTile_2 = null;

        // Lebegő csempék leesése
        if (matches.length > 0) Falldown(self);

    } else if (self.selectedTile_1 && self.selectedTile_2) {
        console.log("Csere vissza!")
        // Visszacseréljük, mert nincsenek párok

        // Adatok eltárolása
        let tile_1_col = self.selectedTile_1.col,
            tile_1_row = self.selectedTile_1.row;
        let tile_2_col = self.selectedTile_2.col,
            tile_2_row = self.selectedTile_2.row;

        // Helycsere
        let animation_time = 0.35;
        if (tile_1_col == tile_2_col) {
            self.Animations.push(
                new Animation(self.selectedTile_1, "row", tile_2_row, animation_time),
                new Animation(self.selectedTile_2, "row", tile_1_row, animation_time)
            );
        } else if (tile_1_row == tile_2_row) {
            self.Animations.push(
                new Animation(self.selectedTile_1, "col", tile_2_col, animation_time),
                new Animation(self.selectedTile_2, "col", tile_1_col, animation_time)
            );
        }

        // self.tiles[tile_1_row][tile_1_col] = self.selectedTile_1;
        // self.tiles[tile_2_row][tile_2_col] = self.selectedTile_2;

        // Megszüntetjük a kijelölést
        self.selectedTile_1 = null;
        self.selectedTile_2 = null;

    } else {
        // Ha nincsenek párok és nincsen semmi sem kijelölve, akkor megkezdjük a feltöltést
        Refill(self);
    }
}

function Falldown(self) {
    console.log("Leesés!");

    for (let y = self.tableSize - 1; y >= 1; y--) {
        for (let x = 0; x < self.tableSize; x++) {
            const currentTile = self.tiles.find(tile => tile.row == y && tile.col == x);
            // console.log(`currentTile: ${currentTile}`);



            if (currentTile.visible) continue;

            let i = 1;
            // Amíg az i kisebb, mint a jelenlegi magasság + 1, hogy a (y - i) sose legyen kisebb, mint 0
            while (i < currentTile.row + 1) {
                // console.log(`i: ${i} y: ${currentTile.row}`);
                // Fölötte lévő csempe
                const upperTile = self.tiles.find(tile => tile.row == currentTile.row - i && tile.col == currentTile.col);

                // Ha látható a csempe
                if (upperTile.visible) {
                    // console.log(`upperTile: ${upperTile}`);

                    // Adatok eltárolása
                    let tile_1_row = currentTile.row;
                    let tile_2_row = upperTile.row;

                    // Hogy ne avatkozzon közbe a következő láthatatlan csempe, a jelenlegi csempét egyből a helyére tesszük, animáció nélkül
                    // A felső csempét pedig lejjebb visszük 0.1-el
                    // Tehát kihasználjuk, hogy a rendszerünk egész számokat keres és a következő láthatatlan csempe már nem fogja megtalálni a láthatót, csak a jelenlegi láthatatlant
                    // És az animációnak sem zavarunk be annyira
                    currentTile.row = tile_2_row;
                    upperTile.row -= 0.1;

                    // Helycsere
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
    // Tehát ha nem fut animáció, akkor manuálisan indítjuk el
    if (self.Animations.length == 0) AfterMath(self);
}

function Refill(self) {
    console.log("Feltöltés!")

    let animation_time = 0.25;

    let negative = -1;
    for (let y = self.tableSize - 1; y >= 0; y--) {
        if (self.tiles.find(tile => tile.row == y && !tile.visible)) {
            negative -= 1;
            animation_time += 0.1;
        }

        for (let x = 0; x < self.tableSize; x++) {
            const currentTile = self.tiles.find(tile => tile.row == y && tile.col == x);
            // console.log(`currentTile: ${currentTile}`);

            if (currentTile.visible) continue;

            let originalY = currentTile.row;
            let newY = negative;


            // console.log(currentTile, currentTile.row)
            let rTile = GetRandomTile(self, currentTile.col, newY);
            let index = self.tiles.indexOf(currentTile);
            self.tiles[index].row = newY;
            self.tiles[index] = rTile;
            // console.log(self.tiles[index]);
            // console.log(self.tiles[index], currentTile.row)

            self.Animations.push(
                new Animation(self.tiles[index], "row", originalY, animation_time, function () {
                    AfterMath(self);
                })
            );
        }
    }
}