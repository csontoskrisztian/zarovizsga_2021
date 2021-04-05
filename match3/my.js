// Az objektum, amiben tárolunk mindent, hogy bárhonnan hozzáférhessünk bármihez
let self = new Object;



// Draw függvény, amit folyamatosan hívogatunk, így akár animációkat is csinálhatunk
// És nem kell aggódni, ha egy kép pár tized mp-el lassabban tölt be, mint ahogy felrajzolnánk
self.draw = function () {
    // Canvas letisztítása minden rajzolás előtt
    self.tableC.clearRect(0, 0, self.$table.width, self.$table.height);

    // Háttér
    self.tableC.fillStyle = "#b3b3b3";
    self.tableC.fillRect(0, 0, self.$table.width, self.$table.height)

    self.tiles.forEach(sor => {
        sor.forEach(tile => {
            // Üres helyet nem rajzolunk fel
            // if (tile == null) return;

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
        })
    });
}

self.update = function (dt) {
    // console.log(dt);

    self.Animations.forEach((animation, index) => {
        // Tényleg 5mp telt el?
        animation.time += dt;

        // SEBESSÉG kiszámolása: v = s/t -> távolság/idő, és mivel csak a szomszédos elemek mozdíthatóak, aetért a távolság mindig 1/-1
        let formula;
        if (animation.duration > 0) {
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

self.load = function () {
    // Animációkat tartalmazó tömb
    self.Animations = [];

    // Kattintásra lefutó függvények tömbje
    self.OnClickListeners = [];

    // Canvas
    self.$table = document.getElementById("Table");

    // x y pozíció
    self.cursorX = 0;
    self.cursorY = 0;
    // Az egér relatív pozíciója
    self.$table.onmousemove = function (e) {
        let parentOffset = e.currentTarget.getBoundingClientRect();
        self.cursorX = e.pageX - parentOffset.x;
        self.cursorY = e.pageY - parentOffset.y;
    }

    self.$table.onclick = function () {
        // Ha animáció játszodik le, akkor le van tíltva az input
        if (self.Animations.length > 0) return;

        // console.log("Kattintás!");
        // console.log(self.OnClickListeners);

        self.OnClickListeners.forEach(element => {
            element();
        });
    }

    // Canvas 2d contectus
    self.tableC = self.$table.getContext('2d');

    // Hányszor hanyas csempékből álljon
    self.tableSize = 8;

    // Tiles tömb létrehozása és feltöltése random csempékkel
    self.tiles = [];
    RandomTilesGenerator(self.tiles, self.tableSize)

    self.selectedTile_1 = null;
    self.selectedTile_2 = null;

    // Kattintásra kijelölünk
    self.OnClickListeners.push(SelectTile);
    // Majd megnézzük miket jelöltünk ki eddig
    self.OnClickListeners.push(CheckSelectedTiles);

    // Folyamatos frissítés
    let lastUpdate = Date.now();
    let interval = setInterval(tick, 0);

    function tick() {
        let now = Date.now();
        let dt = (now - lastUpdate) / 1000;
        lastUpdate = now;

        self.update(dt);
        self.draw();
    };
}

class Tile {
    constructor(type, src, size, col, row) {
        this.type = type;
        this.img = new Image;
        this.img.src = src;
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

    isPositionMacthing(x, y) {
        if (
            x >= this.getX() && x <= this.getX() + this.size &&
            y >= this.getY() && y <= this.getY() + this.size
        ) {
            return true;
        } else {
            return false;
        }
    }

    areNeighboursWith(tile) {
        if (
            // Ha egy oszlopban vannak, de különböző sorban
            this.col == tile.col && (this.row == tile.row + 1 || this.row == tile.row - 1) ||

            // Ha egy sorban vannak, de különböző oszlopban
            this.row == tile.row && (this.col == tile.col + 1 || this.col == tile.col - 1)
        ) {
            return true;
        }

        return false;
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
        this.count = tiles_array.length;
    }
}

function RandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function RandomTilesGenerator(array, size) {
    // Felhasználható képek
    self.fruits = ["Apple", "Avocado", "Banana", "Blackberry", "Cherry"];

    // Előző előtti és előző csempe x tengelyen
    let secondLastTileType_X;
    let firstLastTileType_X;
    // Előző előtti és előző csempe y tengelyen
    let secondLastTileType_Y;
    let firstLastTileType_Y;
    // Jelenlegi csempe
    let currentTileType;

    for (let y = 0; y < size; y++) {
        array[y] = [];
        for (let x = 0; x < size; x++) {
            if (x > 0) {
                firstLastTileType_X = currentTileType;
            }
            if (x > 1) {
                secondLastTileType_X = currentTileType;
                // console.log("X", x, y, secondLastTileType_X);
            }
            if (y > 0) {
                firstLastTileType_Y = array[y - 1][x].type;
            }
            if (y > 1) {
                secondLastTileType_Y = array[y - 2][x].type;
                // console.log("Y", x, y, secondLastTileType_Y);
            }

            // legenerálunk egy random csempetípust, figyelünk arra, hogy ne alakuljon ki 3-as pár
            do {
                currentTileType = self.fruits[RandomNumber(0, self.fruits.length)];
            } while (
                // Ha az előző kettő x tengelyen ugyan olyan 
                (firstLastTileType_X == secondLastTileType_X && secondLastTileType_X == currentTileType) ||
                // Ha az előző kettő y tengelyen ugyan olyan
                (firstLastTileType_Y == secondLastTileType_Y && secondLastTileType_Y == currentTileType)
            );

            let csempe = new Tile(currentTileType, "./img/" + currentTileType + ".png", 50, x, y);
            array[y][x] = csempe;
        }
    }
}

function MatchFounder(array) {
    let foundMatches = [];
    foundMatches["inRow"] = [];
    foundMatches["inCol"] = [];

    // Párok soronként (x tengely)
    // console.log("SORONKÉNT");
    for (let y = 0; y < array.length; y++) {
        let temporary = [array[y][0]];
        for (let x = 1; x < array[y].length; x++) {
            // console.log(temporary[0].type + " == " + array[y][x].type);
            if (temporary[0].type == array[y][x].type) {
                // Ha megegyezik a típusuk, belerakjuk az ideiglenes tömbe
                temporary.push(array[y][x]);
                // console.log(temporary);
            } else {
                // Ha nem egyezik meg, akkor ellenőrízzük az ideiglenes nagyságát
                // És ha 3-nál nagyobb, akkor belerakjuk a talált párok közé
                // console.log(temporary);
                if (temporary.length >= 3) {
                    for (let t = 0; t < temporary.length; t++) {
                        temporary[t].isInPair = true;
                    }
                    foundMatches["inRow"].push(new Pair(temporary));
                }

                // Majd áttérünk a következő új típusra
                temporary = [array[y][x]];
            }
        };
    };

    // Párok oszloponként (y tengely)
    // console.log("OSZLOPONKÉNT");
    for (let x = 0; x < array.length; x++) {
        let temporary = [array[0][x]];
        for (let y = 1; y < array[x].length; y++) {
            // console.log(temporary[0].type + " == " + array[y][x].type + " ("+y+","+x+")");
            if (temporary[0].type == array[y][x].type) {
                // Ha megegyezik a típusuk, belerakjuk az ideiglenes tömbe
                temporary.push(array[y][x]);
                // console.log(temporary);
            } else {
                // Ha nem egyezik meg, akkor ellenőrízzük az ideiglenes nagyságát
                // És ha 3-nál nagyobb, akkor belerakjuk a talált párok közé
                // console.log(temporary);
                if (temporary.length >= 3) {
                    for (let t = 0; t < temporary.length; t++) {
                        temporary[t].isInPair = true;
                    }
                    foundMatches["inCol"].push(new Pair(temporary));
                }
                // console.log(foundMatches["inCol"]);

                // Majd áttérünk a következő új típusra
                temporary = [array[y][x]];
            }
        };

        // Mielőtt tovább mennénk a következő oszlopba, szintén lellenőrizzük van-e pár
        if (temporary.length >= 3) {
            for (let t = 0; t < temporary.length; t++) {
                temporary[t].isInPair = true;
            }
            foundMatches["inCol"].push(new Pair(temporary));
        }
    };


    return foundMatches;
}

function SelectTile() {
    // Egy tile kijelölése
    let breakForEach = false;
    self.tiles.forEach(sor => {
        sor.forEach(tile => {
            if (tile.isPositionMacthing(self.cursorX, self.cursorY)) {
                // console.log(tile.type);

                if (self.selectedTile_1 == null) {
                    // Ha nincs semmi kijelölve, jelölje ki
                    self.selectedTile_1 = tile;

                    breakForEach = true;
                } else if (self.selectedTile_1 == tile) {
                    // Ha ki van már jelölve, szüntesse meg
                    self.selectedTile_1 = null;

                    breakForEach = true;
                } else if (self.selectedTile_2 == null && self.selectedTile_1.areNeighboursWith(tile)) {
                    // Ha szomszédok az első kijelöléssel, akkor jelölje ki
                    self.selectedTile_2 = tile;

                    breakForEach = true;
                } else {
                    // Ha nincs az első kijelölése közvetlen közelében, akkor legyen ez az első kijelölés
                    self.selectedTile_1 = tile;

                    breakForEach = true;
                }

                // console.log("Tile 1", self.selectedTile_1);
                // console.log("Tile 2", self.selectedTile_2);

                if (breakForEach) {
                    return;
                };
            };
        });
    });
}

function CheckSelectedTiles() {
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
                new Animation(self.selectedTile_2, "row", tile_1_row, animation_time, afterMoveAnimation)
            );
            // console.log(self.selectedTile_1);
            // console.log(self.selectedTile_2);
            // console.log(tile_1_col, tile_1_row);
            // console.log(tile_2_col, tile_2_row);
        } else if (tile_1_row == tile_2_row) {
            self.Animations.push(
                new Animation(self.selectedTile_1, "col", tile_2_col, animation_time),
                new Animation(self.selectedTile_2, "col", tile_1_col, animation_time, afterMoveAnimation)
            );
            // console.log(self.selectedTile_1);
            // console.log(self.selectedTile_2);
            // console.log(tile_1_col, tile_1_row);
            // console.log(tile_2_col, tile_2_row);
        }

        function afterMoveAnimation() {
            // Array pozíciók felcserélés
            // console.log(self.tiles[tile_1_row][tile_1_col]);
            self.tiles[tile_1_row][tile_1_col] = self.selectedTile_2;
            // console.log(self.tiles[tile_1_row][tile_1_col]);
            // console.log("---");
            // console.log(self.tiles[tile_2_row][tile_2_col]);
            self.tiles[tile_2_row][tile_2_col] = self.selectedTile_1;
            // console.log(self.tiles[tile_2_row][tile_2_col]);

            // console.log("Tile 1", self.tiles[tile_1_row][tile_1_col]);
            // console.log("Tile 2", self.tiles[tile_2_row][tile_2_col]);

            // console.log(self.selectedTile_1.getX(), self.selectedTile_1.getY());
            // console.log(self.selectedTile_2.getX(), self.selectedTile_2.getY());

            // Talált párok
            let matches = MatchFounder(self.tiles);

            // console.log(matches);
            // return;

            if (matches["inRow"].length > 0 || matches["inCol"].length > 0) {
                console.log("Párok törlése!")

                // Láthatatlanná teszük a párokat
                matches["inRow"].forEach(pairs => {
                    pairs.tiles.forEach(tile => {
                        tile.visible = false;
                    });
                });
                matches["inCol"].forEach(pairs => {
                    pairs.tiles.forEach(tile => {
                        tile.visible = false;
                    });
                });

                Falldown(matches);
            } else {
                console.log("Csere vissza!")
                // Visszacseréljük, mert nincsenek párok

                if (tile_1_col == tile_2_col) {
                    self.Animations.push(
                        new Animation(self.selectedTile_1, "row", tile_1_row, animation_time),
                        new Animation(self.selectedTile_2, "row", tile_2_row, animation_time)
                    );
                } else if (tile_1_row == tile_2_row) {
                    self.Animations.push(
                        new Animation(self.selectedTile_1, "col", tile_1_col, animation_time),
                        new Animation(self.selectedTile_2, "col", tile_2_col, animation_time)
                    );
                }

                self.tiles[tile_1_row][tile_1_col] = self.selectedTile_1;
                self.tiles[tile_2_row][tile_2_col] = self.selectedTile_2;
            }


            // Megszüntetjük a kijelölést
            self.selectedTile_1 = null;
            self.selectedTile_2 = null;
        }
    }
}

function Falldown(matches) {
    console.log("Leesés!")
    let keys = Object.keys(matches);
    // console.log(keys);
    let animation_time = 0.35;

    keys.forEach(key => {
        if (matches[key].length == 0) return;

        for (let p = 0; p < matches[key].length; p++) {
            let pair = matches[key][p];

            for (let i = 0; i < pair.count; i++) {
                // Shallow copy
                let copyTiles = [...self.tiles];

                copyTiles[pair.tiles[i].row].forEach((tile, index) => {
                    // Ha a tile nem része egy párnak és egy oszlopban van a pár valamelyik tagjával
                    if (tile != null && !tile.isInPair && pair.tiles[0].row > tile.row && pair.tiles[0].col <= tile.col && pair.tiles[pair.count - 1].col >= tile.col) {
                        let plus;

                        // Ha "oszlop pár" van
                        if (key == "inCol") {
                            // Lejjebb visszük annyival, mint amennyi pár van abban az oszlopban
                            plus = pair.count;
                            // console.log(tile, plus);

                            // Ha "sor pár" van
                        } else {
                            // Lejjebb visszük annyival, mint amennyi pár van azokban az oszlopokban
                            plus = matches[key].length;
                            // console.log(tile, plus);
                        }

                        // Helycsere
                        console.log(tile, tile.row, plus);
                        self.tiles[tile.row + plus][index] = tile;
                        self.tiles[tile.row][index] = pair.tiles[i];
                    }
                });
            }
        }
    });

    self.tiles.forEach((row, index) => {
        row.forEach(tile => {
            if (tile.row != index) {
                self.Animations.push(
                    new Animation(tile, "row", index, animation_time)
                );
            }
        });
    });

    animation_time = 0.5;

    let minus;
    keys.forEach(key => {
        if (matches[key].length == 0) return;
        for (let i = matches[key] - 1; i >= 0; i--) {
            console.log(key);
            minus = Math.min.apply(Math, matches[key][i].pair.map(x => {
                if (x.row > 0) {
                    return x.row;
                } else {
                    return self.tableSize
                }
            }));

            for (let j = 0; j < matches[key][i].count; j++) {
                let tile = matches[key][i][j];
                if (tile.isInPair) continue;
                console.log("index: " + i, j);

                // Láthatókör fölé helyezzük a leesés érdekében
                let mRow = tile.row;
                tile.row = tile.row - self.tableSize;
                console.log(tile, tile.row);

                // Új type-ot kap és láthatóvá tesszük
                let rType = self.fruits[RandomNumber(0, self.fruits.length)];
                tile.type = rType;
                tile.img.src = "./img/" + rType + ".png"
                tile.visible = true;
                tile.isInPair = false;

                self.Animations.push(
                    new Animation(tile, "row", mRow, animation_time)
                );
            }

            matches[key].splice(i, 1);
        }
    });

    console.log(self.tiles);
    console.log(self.Animations);

    // matches[key] = [];
    // console.log(matches);
    // console.log(self.Animations);
}


// Mikor betöltődik az ablak, induljon el a játék betöltése
window.onload = self.load;