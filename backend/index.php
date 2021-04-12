<?php
ini_set("display_errors", "off");

session_start();


require_once "core/config.php";
require_once "autoload.php";

(new \core\App())->start();