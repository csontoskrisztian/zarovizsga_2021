<?php
//?query=jatszmaLepesekRekordById

namespace queries;

class JatszmaLepesekRekordById extends \queries\ParentRekordById
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Adott játszm lépés";
        $this->sql = "SELECT * FROM jatszmaLepesek
                        WHERE jatszmakId = ?";
        $this->typesString = "i";
        $this->paramVariables = [$params["jatszmakId"]];
        $this->columns = [
            "id" => "id",
            "jatszmakId" => "jatszmakId",
            "selected1_X" => "selected1_X",
            "selected1_Y" => "selected1_Y",
            "selected2_X" => "selected2_X",
            "selected2_Y" => "selected2_Y"
        ];
    }
}
