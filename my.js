// Az objektum, amiben tárolunk mindent, hogy bárhonnan hozzáférhessünk bármihez
let self = new Object;

// Draw függvény, amit 10 mp-ként hívogatunk, így akár animációkat is csinálhatunk
// És nem kell aggódni, ha egy kép pár tized mp-el lassabban tölt be, mint ahogy felrajzolnánk
self.draw = function (dt) {
    // console.log(dt);

    // Canvas letisztítása minden rajzolás előtt
    self.tableC.clearRect(0, 0, self.$table.width, self.$table.height);

    // Háttér
    self.tableC.fillStyle = "#b3b3b3";
    self.tableC.fillRect(0, 0, self.$table.width(), self.$table.height())

    self.tiles.forEach(oszlop => {
        oszlop.forEach(tile => {
            if (tile == self.selectedTile_1 || tile == self.selectedTile_2) {
                // Rajzolja meg a képet
                self.tableC.drawImage(tile.img, tile.getX(), tile.getY(), tile.width, tile.height);

                // Összetett operátor típusa = duplikálás (felső pixel színe * alsó pixel színe)
                self.tableC.globalCompositeOperation = "multiply";

                // Kiválasztás színe és felrajzolása
                self.tableC.fillStyle = "#b3b3b3";
                self.tableC.fillRect(tile.getX(), tile.getY(), tile.width, tile.height);

                // Visszaállítás
                self.tableC.globalCompositeOperation = "source-over";
            } else {
                self.tableC.drawImage(tile.img, tile.getX(), tile.getY(), tile.width, tile.height);
            }
        })
    });
}

self.update = function (dt) {
    // console.log(dt);

    if (self.selectedTile_1 != null && self.selectedTile_2 != null) {
        console.log(self.selectedTile_1.getX(), self.selectedTile_1.getY());
        console.log(self.selectedTile_2.getX(), self.selectedTile_2.getY());
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

        console.log("Tile 1", self.tiles[tile_1_row][tile_1_col]);
        console.log("Tile 2", self.tiles[tile_2_row][tile_2_col]);

        console.log(self.selectedTile_1.getX(), self.selectedTile_1.getY());
        console.log(self.selectedTile_2.getX(), self.selectedTile_2.getY());

        self.selectedTile_1 = null;
        self.selectedTile_2 = null;

    }
}

$(() => {
    // Canvas
    self.$table = $("#Table");

    // x y pozíció
    self.cursorX = 0;
    self.cursorY = 0;
    // Mozgásra változik
    self.$table.mousemove((e) => {
        let parentOffset = e.currentTarget.getBoundingClientRect();
        self.cursorX = e.pageX - parentOffset.x;
        self.cursorY = e.pageY - parentOffset.y;
    });
    // Kattintásra kiíródik
    self.$table.click((e) => {
        self.tiles.forEach((oszlop, i) => {
            oszlop.forEach((tile, j) => {
                if (tile.isPositionMacthing(self.cursorX, self.cursorY)) {
                    // console.log(tile.type);

                    if (self.selectedTile_1 == null) {
                        self.selectedTile_1 = tile;
                    } else if (self.selectedTile_1 == tile) {
                        self.selectedTile_1 = null;
                    } else if (self.selectedTile_2 == null && self.selectedTile_1.areNeighboursWith(tile)) {
                        self.selectedTile_2 = tile;
                    } else if (self.selectedTile_2 == tile) {
                        self.selectedTile_2 = null;
                    }

                    console.log("Tile 1", self.selectedTile_1);
                    console.log("Tile 2", self.selectedTile_2);
                };
            });
        });
    });

    // Canvas 2d contectus
    self.tableC = self.$table[0].getContext('2d');

    // Hányszor hanyas csempékből álljon
    self.tableSize = 8;

    // Felhasználható képek
    let fruits = ["Apple", "Avocado", "Banana", "Blackberry", "Cherry"];

    // Tiles tömb létrehozása és feltöltése random csempékkel
    self.tiles = [];
    for (let i = 0; i < self.tableSize; i++) {
        self.tiles[i] = [];
        for (let j = 0; j < self.tableSize; j++) {
            // Egy csempe
            let randomGyumolcs = fruits[RandomNumber(0, fruits.length)];
            let csempe = new Tile(randomGyumolcs, "./img/" + randomGyumolcs + ".png", 50, j, i);
            self.tiles[i][j] = csempe;
        }
    }

    self.selectedTile_1 = null;
    self.selectedTile_2 = null;

    // Folyamatos frissítés
    let perfectFramePerSec = (60 / 1000);
    let lastUpdate = Date.now();
    setInterval(tick, 0);

    function tick() {
        let now = Date.now();
        let dt = (now - lastUpdate) / perfectFramePerSec;
        lastUpdate = now;

        self.update(dt);
        self.draw(dt);
    };
});

class Tile {
    constructor(type, src, size, col, row) {
        this.type = type;
        this.img = new Image;
        this.img.src = src;
        this.img.width = size;
        this.img.height = size;
        this.width = size;
        this.height = size;
        this.col = col;
        this.row = row;
    }

    getX() {
        return this.col * this.width;
    };
    getY() {
        return this.row * this.height;
    };

    isPositionMacthing(x, y) {
        if (
            x >= this.getX() && x <= this.getX() + this.width &&
            y >= this.getY() && y <= this.getY() + this.height
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

function RandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}