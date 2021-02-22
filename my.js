// Az objektum, amiben tárolunk mindent, hogy bárhonnan hozzáférhessünk bármihez
let self = new Object;

// Draw függvény, amit folyamatosan hívogatunk, így akár animációkat is csinálhatunk
// És nem kell aggódni, ha egy kép pár tized mp-el lassabban tölt be, mint ahogy felrajzolnánk
self.draw = function () {
    // Canvas letisztítása minden rajzolás előtt
    self.tableC.clearRect(0, 0, self.$table.width, self.$table.height);

    // Háttér
    self.tableC.fillStyle = "#b3b3b3";
    self.tableC.fillRect(0, 0, self.$table.width(), self.$table.height())

    self.tiles.forEach(sor => {
        sor.forEach(tile => {
            // Csak akkor rajzoljuk fel, ha látható
            if (tile.visible) {

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
        if(Math.floor(animation.target[animation.property]) != animation.value) {
            // Tényleg 5mp telt el?
            animation.time += dt / self.Animations.length;

            // SEBESSÉG kiszámolása: v = s/t -> értek/idő
            animation.target[animation.property] += (animation.value / animation.duration) * dt;
        } else {
            animation.target[animation.property] = Math.round(animation.target[animation.property]);
            animation.time = Math.round(animation.time);

            console.log("Idő: "+animation.time+" mp");
            console.log("Érték: "+animation.target[animation.property]);

            let promise = animation.promise;

            self.Animations.splice(index, 1);

            promise();
        }
    });
}

$(() => {
    // Canvas
    self.$table = $("#Table");

    // x y pozíció
    self.cursorX = 0;
    self.cursorY = 0;
    // Az egér relatív pozíciója
    self.$table.mousemove((e) => {
        let parentOffset = e.currentTarget.getBoundingClientRect();
        self.cursorX = e.pageX - parentOffset.x;
        self.cursorY = e.pageY - parentOffset.y;
    });
    self.$table.click((e) => {
        if (self.Animations.length > 0) return;
        
        // Egy tile kijelölése
        self.tiles.forEach(sor => {
            sor.forEach(tile => {
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
                };
            });
        });

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

            // Adatbeli felcserélés
            // console.log("Tile 1")
            // console.log(self.selectedTile_1.col, tile_2_col);
            self.selectedTile_1.col = tile_2_col;
            // console.log(self.selectedTile_1.col);
            // console.log(self.selectedTile_1.row, tile_2_row);
            self.selectedTile_1.row = tile_2_row;
            // console.log(self.selectedTile_1.row);

            // console.log("Tile 2")
            // console.log(self.selectedTile_2.col, tile_1_col);
            self.selectedTile_2.col = tile_1_col;
            // console.log(self.selectedTile_2.col);
            // console.log(self.selectedTile_2.row, tile_1_row);
            self.selectedTile_2.row = tile_1_row;
            // console.log(self.selectedTile_2.row);

            // Fizikai felcserélés
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
                matches["inRow"].forEach(tile => {
                    tile.visible = false;
                });
                matches["inCol"].forEach(tile => {
                    tile.visible = false;
                });

                console.log("Leesés!")
                for (let y = self.tiles.length - 1; y >= 0; y--) {
                    for (let x = 0; x < self.tiles[y].length; x++) {
                        if ((matches["inRow"].includes(self.tiles[y][x]) || matches["inCol"].includes(self.tiles[y][x])) && y - 1 != -1) {
                            let emptyTile = self.tiles[y][x];
                            let hitTile;
                            let counter = 1;
                            // Megkeressük a legelső felette lévő csempét, ami nem láthatatlan
                            while ((!self.tiles[y - counter][x].visible) && y - counter > 0) {
                                counter++;
                            };
                            hitTile = self.tiles[y - counter][x];

                            // console.log("emptyTile:", y, x, "->", "hitTile:", y - counter, x);

                            // Kicseréljük vele
                            tile_1_col = emptyTile.col;
                            tile_1_row = emptyTile.row;
                            tile_2_col = hitTile.col;
                            tile_2_row = hitTile.row;

                            hitTile.col = tile_1_col;
                            hitTile.row = tile_1_row;
                            emptyTile.col = tile_2_col;
                            emptyTile.row = tile_2_row;

                            self.tiles[tile_1_row][tile_1_col] = hitTile;
                            self.tiles[tile_2_row][tile_2_col] = emptyTile;
                        }
                    }
                }
            } else {
                console.log("Csere vissza!")
                // Visszacseréljük, mert nincsenek párok

                self.selectedTile_1.col = tile_1_col;
                self.selectedTile_1.row = tile_1_row;
                self.selectedTile_2.col = tile_2_col;
                self.selectedTile_2.row = tile_2_row;

                self.tiles[tile_1_row][tile_1_col] = self.selectedTile_1;
                self.tiles[tile_2_row][tile_2_col] = self.selectedTile_2;
            }


            // Megszüntetjük a kijelölést
            self.selectedTile_1 = null;
            self.selectedTile_2 = null;
        }
    });

    // Canvas 2d contectus
    self.tableC = self.$table[0].getContext('2d');

    // Hányszor hanyas csempékből álljon
    self.tableSize = 8;

    // Tiles tömb létrehozása és feltöltése random csempékkel
    self.tiles = [];
    RandomTilesGenerator(self.tiles, self.tableSize)

    self.selectedTile_1 = null;
    self.selectedTile_2 = null;

    // Folyamatos frissítés
    let lastUpdate = Date.now();
    setInterval(tick, 0);

    function tick() {
        let now = Date.now();
        let dt = (now - lastUpdate) / 1000;
        lastUpdate = now;

        self.update(dt);
        self.draw();
    };
});

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
    constructor(target, property, value, duration, promise=function(){}) {
        this.target = target;
        this.property = property;
        this.value = value;
        this.duration = duration;
        this.promise = promise;

        this.time = 0;
    }
}

function RandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function RandomTilesGenerator(array, size) {
    // Felhasználható képek
    let fruits = ["Apple", "Avocado", "Banana", "Blackberry", "Cherry"];

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
                currentTileType = fruits[RandomNumber(0, fruits.length)];
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
    for (let y = 0; y < array.length; y++) {
        let firstToLast;
        let secondToLast;
        for (let x = 0; x < array[y].length; x++) {
            if (x > 1) {
                // Előtte lévő
                firstToLast = x - 1;
                // Kettővel előtte
                secondToLast = x - 2;

                if (array[y][secondToLast].type == array[y][firstToLast].type && array[y][firstToLast].type == array[y][x].type) {
                    foundMatches["inRow"].push(array[y][secondToLast]);
                    foundMatches["inRow"].push(array[y][firstToLast]);
                    foundMatches["inRow"].push(array[y][x]);
                }
            }
        };
    };

    // Párok oszloponként (y tengely)
    for (let x = 0; x < array[0].length; x++) {
        let firstToLast;
        let secondToLast;
        for (let y = 0; y < array.length; y++) {
            if (y > 1) {
                // Fölötte lévő
                firstToLast = y - 1;
                // Kettővel fölötte lévő
                secondToLast = y - 2;

                if (array[secondToLast][x].type == array[firstToLast][x].type && array[firstToLast][x].type == array[y][x].type) {
                    foundMatches["inCol"].push(array[secondToLast][x]);
                    foundMatches["inCol"].push(array[firstToLast][x]);
                    foundMatches["inCol"].push(array[y][x]);
                }
            }
        };
    };

    return foundMatches;
}