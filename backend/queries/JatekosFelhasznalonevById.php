<?php
//?query=jatekosFelhasznalonevById

namespace queries;

class JatekosFelhasznalonevById extends \queries\ParentRekordById
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Jatekos felhaszaloneve";
        $this->sql = "SELECT felhasznalonev FROM jatekosok
                        WHERE id = ?";
        $this->typesString = "i";
        $this->paramVariables = [$params["id"]];
        $this->columns = [
            "felhasznalonev" => "Felhasználónév"
        ];
    }
}
