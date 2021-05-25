<?php
//?query=jatszmakRekordById

namespace queries;

class JatszmakRekordById extends \queries\ParentRekordById
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Adott jatszma";
        $this->sql = "SELECT * FROM jatszmak
                        WHERE id = ?";
        $this->typesString = "i";
        $this->paramVariables = [$params["id"]];
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
