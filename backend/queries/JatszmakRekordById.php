<?php
//?query=jatszmakRekordById

namespace queries;

class JatszmakRekordById extends \queries\ParentRekordById
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Keresett játékos";
        $this->sql = "SELECT * FROM jatszmak
                        WHERE jatekos1_id = ? or jatekos2_id = ?
                        LIMIT 10";
        $this->typesString = "ii";
        $this->paramVariables = [$params["id"], $params["id"]];
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
