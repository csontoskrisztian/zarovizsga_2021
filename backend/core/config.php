<?php
$config = [
    "db_host" => "localhost",
    "db_name" => "match3",
    "db_user" => "root",
    "db_pass" => ""
];

function logMessage($level, $message){
    //w: újraírja, a: hozzáfűzi
    //$file: erőforrás típusú változó
    $file = fopen("application.log", "a");
    //PHP_EOL: új sor az oprendszerben
    fwrite($file, "[$level] $message".PHP_EOL);
    //fájl lezásrása
    fclose($file);
}


?>