<?php
session_id('ekr11fi4ijs2fn7fpdi441n3i0');
session_start();

ini_set("display_errors", "off");
ini_set('session.cookie_secure','Off');

require_once "core/config.php";
require_once "autoload.php";

(new \core\App())->start();