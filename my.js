$(() => {
    let $table = $("#Table");
    $table.width(400);
    $table.height(400);
    let tableC = $table[0].getContext('2d');

    let img = new Image;
    img.src = "./img/Apple.png";

    img.onload = function() {
        // Lehetséges egy képet több részre vágni, tehát a dolgokat egy nagy képen tárolni, betölteni, majd megjelenítésnél felvágni és külön-külön használni
        tableC.drawImage(img, 90, 130, 50, 60, 10, 10, 50, 60);
    };

})