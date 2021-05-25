<?php
namespace core;

class Connect {
    public function connect(){
        global $config;
        $connection = mysqli_connect( $config["db_host"], $config["db_user"], $config["db_pass"], $config["db_name"]);
        //Ha nem tud csatlakozni, akkor a connection false lesz    
        if (!$connection) {
            logMessage("ERROR","connectin error: ".mysqli_connect_error());
        }
        mysqli_query($connection, "SET NAMES UTF8");
        return $connection;
    }
}
