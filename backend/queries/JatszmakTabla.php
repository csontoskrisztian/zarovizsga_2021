<?php
//?query=jatszmakTabla

namespace queries;

class JatszmakTabla extends \queries\ParentTabla {
    public function __construct($params){
        parent::__construct($params);
        $this->title = "Játszmák";
        $this->sql = "SELECT * FROM jatszmak";
        $this->columns = [
            "id" => "id",
            "jatekos1_id" => "Játékos 1",
            "jatekos2_id" => "Játékos 2",
            "jatekos1_pont" => "Játékos 1 Pontszám",
            "jatekos2_pont" => "Játékos 2 Pontszám",
            "allapot" => "Állapot",
            "jatekido" => "Játék idő",
            "maxido" => "Maximum idő",
            "nehezseg" => "Nehézségi szint"
        ];
    }
}
