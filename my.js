$(() => {
    let $table = $("#Table");
    $table.width(400);
    $table.height(400);
    let tableC = $table[0].getContext('2d');
    tableC.fillStyle = " #b3b3b3";
    tableC.fillRect(0, 0, $table.width(), $table.height())

    let img = new Image;
    let img_width = 50;
    let img_height = img_width / 2;
    
    img.onload = function() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                tableC.drawImage(img, 0 + (img_width * x), 0 + (img_height * y), img_width, img_height);
            }
        }
    };
    
    img.src = "./img/Apple.png";
})