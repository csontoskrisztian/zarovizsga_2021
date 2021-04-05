<?php
//?query=baratokTabla

namespace queries;

class BaratokTabla extends \queries\ParentTabla {
    public function __construct($params){
        parent::__construct($params);
        $this->title = "Barátok";
        $this->sql = "SELECT * FROM baratok";
        $this->columns = [
            "jatekos1_id" => "Játékos 1",
            "jatekos2_id" => "Játékos 2"
        ];
    }
}
