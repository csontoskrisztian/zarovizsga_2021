<?php
return [
    "jatszmaLepesekInsert" => function ($params){
        (new \queries\JatszmaLepesekInsert($params))->render();
    },
    "baratokDelete" => function ($params){
        (new \queries\BaratokDelete($params))->render();
    },
    "jatszmakDelete" => function ($params){
        (new \queries\JatszmakDelete($params))->render();
    },
    "jatszmakUpdate" => function ($params){
        (new \queries\JatszmakUpdate($params))->render();
    },
    "jatekosOnlineUpdate" => function ($params){
        (new \queries\JatekosOnlineUpdate($params))->render();
    },
    "jatekosJelszoUpdate" => function ($params){
        (new \queries\JatekosJelszoUpdate($params))->render();
    },
    "jatekosFelhasznalonevUpdate" => function ($params){
        (new \queries\JatekosFelhasznalonevUpdate($params))->render();
    },
    "jatszmaTabla" => function ($params){
        (new \queries\JatszmaTabla($params))->render();
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
    "jatszmak10RekordById" => function ($params){
        (new \queries\Jatszmak10RekordById($params))->render();
    },
    "jatszmakRekordById" => function ($params){
        (new \queries\JatszmakRekordById($params))->render();
    },
    "jatszmakRekordByAllapot" => function ($params){
        (new \queries\JatszmakRekordByAllapot($params))->render();
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
    "jatekosokTop" => function ($params){
        (new \queries\JatekosokTop($params))->render();
    },
    "jatekosokBottom" => function ($params){
        (new \queries\JatekosokBottom($params))->render();
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
    },
    "checkPassword" => function ($params){
        (new \queries\CheckPassword($params))->check();
    },
    "checkUsernameEmail" => function ($params){
        (new \queries\CheckUsernameEmail($params))->check();
    }
];