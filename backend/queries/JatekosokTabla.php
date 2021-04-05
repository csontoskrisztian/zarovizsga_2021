<?php
//?query=jatekosokTabla

namespace queries;

class JatekosokTabla extends \queries\ParentTabla {
    public function __construct($params){
        parent::__construct($params);
        $this->title = "Játékosok";
        $this->sql = "SELECT * FROM jatekosok";
        $this->columns = [
            "id" => "id",
            "felhasznalonev" => "Felhasználónév",
            "jelszo" => "Jelszó"
        ];
    }
}
