$(() => {
    let $table = $("#Table");
    $table.width(300);
    let tableC = $table[0].getContext('2d');

    let img = new Image;
    img.src = "./img/Apple.png";

    img.onload = function() {
        tableC.drawImage(img, 10, 10, 100, 100);
    };

})