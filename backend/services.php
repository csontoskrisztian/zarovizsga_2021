<?php
return [
    "baratokDelete" => function ($params){
        (new \queries\BaratokDelete($params))->render();
    },
    "jatszmaUpdate" => function ($params){
        (new \queries\JatszmaUpdate($params))->render();
    },
    "jatekosJelszoUpdate" => function ($params){
        (new \queries\JatekosJelszoUpdate($params))->render();
    },
    "jatekosFelhasznalonevUpdate" => function ($params){
        (new \queries\JatekosFelhasznalonevUpdate($params))->render();
    },
    "jatszmakTabla" => function ($params){
        (new \queries\JatszmakTabla($params))->render();
    },
    "jatszmakInsert" => function ($params){
        (new \queries\JatszmakInsert($params))->render();
    },
    "jatekosokInsert" => function ($params){
        (new \queries\JatekosokInsert($params))->render();
    },
    "jatszmakRekordById" => function ($params){
        (new \queries\JatszmakRekordById($params))->render();
    },
    "baratokInsert" => function ($params){
        (new \queries\BaratokInsert($params))->render();
    },
    "jatekosSearch" => function ($params){
        (new \queries\JatekosSearch($params))->render();
    },
    "jatekosPontszam" => function ($params){
        (new \queries\JatekosPontszam($params))->render();
    },
    "jatekosokTabla" => function ($params){
        (new \queries\JatekosokTabla($params))->render();
    },
    "baratokTabla" => function ($params){
        (new \queries\BaratokTabla($params))->render();
    },
    "jatekosTorlesUpdate" => function ($params){
        (new \queries\JatekosTorlesUpdate($params))->render();
    },
    "paramsError" => function ($params){
        (new \core\ParamsError($params))->render();
    },
    "loginUser" => function ($params){
        (new \queries\LoginUser($params))->login();
    },
    "logoutUser" => function ($params){
        (new \queries\LogoutUser($params))->logout();
    },
    "getUser" => function ($params){
        (new \queries\GetUser($params))->getUser();
    }
];