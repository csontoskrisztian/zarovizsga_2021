<?php
//?query=jatszmakRekordByAllapot

namespace queries;

class JatszmakRekordByAllapot extends \queries\ParentRekordById
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Futó jatszmák 2. játékos nélkül";
        $this->sql = "SELECT * FROM jatszmak
                        WHERE allapot = ? AND jatekos2_id IS NULL
                        LIMIT 1";
        $this->typesString = "i";
        $this->paramVariables = [1];
        $this->columns = [
            "id" => "id",
            "jatekos1_id" => "jatekos1_id",
            "jatekos2_id" => "jatekos2_id",
            "jatekos1_pont" => "jatekos1_pont",
            "jatekos2_pont" => "jatekos2_pont",
            "allapot" => "allapot",
            "jatekido" => "jatekido",
            "maxido" => "nehezseg",
            "seed" => "seed",
            "kor" => "kor"
        ];
    }
}
