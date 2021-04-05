<?php
//?query=jatekosSearch

namespace queries;

class JatekosSearch extends \queries\ParentRekordById
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Keresett játékos";
        $this->sql = "SELECT id, felhasznalonev FROM jatekosok WHERE felhasznalonev LIKE ?";
        $this->typesString = "s";
        $this->paramVariables = ["%".$params["search"]."%"];
        $this->columns = [
            "id" => "id",
            "felhasznalonev" => "Felhasználónév",
        ];
    }
}
