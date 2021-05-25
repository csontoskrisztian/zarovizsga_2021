<?php

//autoloader készítése
function autoload($className){
    $classPath = __DIR__."/".$className.".php";
    $classPath = strtr($classPath,"/\\",DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR);
    // print $classPath;
    if (file_exists($classPath)) {
        // var_dump("Home: ".$classPath);
        include_once $classPath;
    }
}

spl_autoload_register("autoload");
