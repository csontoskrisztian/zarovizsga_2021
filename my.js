// Az objektum, amiben tárolunk mindent, hogy bárhonnan hozzáférhessünk bármihez
let self = new Object;

// Draw függvény, amit 10 mp-ként hívogatunk, így akár animációkat is csinálhatunk
// És nem kell aggódni, ha egy kép pár tized mp-el lassabban tölt be, mint ahogy felrajzolnánk
self.draw = function(dt) {
    // console.log(dt);

    // Canvas letisztítása minden rajzolás előtt
    self.tableC.clearRect(0, 0, self.$table.width, self.$table.height);

    for (let x = 0; x < self.tableSize; x++) {
        for (let y = 0; y < self.tableSize; y++) {
            self.tableC.drawImage(self.img, 0 + (self.img_width * x), 0 + (self.img_height * y), self.img_width, self.img_height);
        }
    }
}

self.update = function(dt) {
    // console.log(dt);
}

$(() => {
    // Folyamatos frissítés
    let lastUpdate = Date.now();
    setInterval(tick, 0);
    function tick() {
        let now = Date.now();
        let dt = now - lastUpdate;
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
    // Háttér
    self.tableC.fillStyle = " #b3b3b3";
    self.tableC.fillRect(0, 0, self.$table.width(), self.$table.height())

    // Hányszor hanyas csempékből álljon
    self.tableSize = 8;

    // Egy csempe
    self.img = new Image;
    self.img.src = "./img/Apple.png";
    self.img_width = 50;
    self.img_height = self.img_width / 2;
})
