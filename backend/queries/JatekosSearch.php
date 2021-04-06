<?php
//?query=jatekosSearch

namespace queries;

class JatekosSearch extends \queries\ParentRekordById
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Keresett játékos";
        $this->sql = "SELECT id, felhasznalonev FROM jatekosok
                        WHERE felhasznalonev LIKE ? AND id != ? AND id NOT IN (SELECT j.id FROM baratok b
                      INNER JOIN jatekosok j ON j.id = b.jatekos2_id
                      WHERE b.jatekos1_id = ?
                    UNION
                    SELECT j.id FROM baratok b
                      INNER JOIN jatekosok j ON j.id = b.jatekos1_id
                      WHERE b.jatekos2_id = ?)";
        $this->typesString = "siii";
        $this->paramVariables = [
            "%" . $params["felhasznalonev"] . "%", 
            $params["id"],
            $params["id"],
            $params["id"],
        ];
        $this->columns = [
            "id" => "id",
            "felhasznalonev" => "Felhasználónév",
        ];
    }
}
