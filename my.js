// Az objektum, amiben tárolunk mindent, hogy bárhonnan hozzáférhessünk bármihez
let self = new Object;

// Draw függvény, amit 10 mp-ként hívogatunk, így akár animációkat is csinálhatunk
// És nem kell aggódni, ha egy kép pár tized mp-el lassabban tölt be, mint ahogy felrajzolnánk
self.draw = function(dt) {
    // console.log(dt);

    // Canvas letisztítása minden rajzolás előtt
    self.tableC.clearRect(0, 0, self.$table.width, self.$table.height);

    // Háttér
    self.tableC.fillStyle = "#b3b3b3";
    self.tableC.fillRect(0, 0, self.$table.width(), self.$table.height())

    self.tiles.forEach(oszlop => {
        oszlop.forEach(tile => {
            self.tableC.drawImage(tile.img, tile.x, tile.y, tile.width, tile.height);
        })
    });


    // self.tableC.drawImage(self.img, self.img_x, self.img_y, self.img_width, self.img_height);
}

self.update = function(dt) {
    // console.log(dt);

    // dt hazsnálata nélkül
    // self.img_x += 1;

    // dt hazsnálatával
    // self.img_x += 1 * dt;
}

$(() => {
    // Folyamatos frissítés
    let perfectTimePerFrame = (1000 / 60);
    let lastUpdate = Date.now();
    setInterval(tick, 0);
    function tick() {
        let now = Date.now();
        let dt = (now - lastUpdate) / perfectTimePerFrame;
        lastUpdate = now;

        self.update(dt);
        self.draw(dt);
    };


    // Canvas
    self.$table = $("#Table");
    self.$table.width(400);
    self.$table.height(400);

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
            let csempe = new Tile("./img/" + fruits[RandomNumber(0, fruits.length - 1)] + ".png", 50, 0 + (50 * j), 0 + (25 * i));
            self.tiles[i][j] = csempe;
        }
    }
})

class Tile {
    constructor(src, size, x, y) {
        this.img = new Image
        this.img.src = src;
        this.width = size;
        this.height = size / 2;
        this.x = x;
        this.y = y;
    }
}

function RandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}