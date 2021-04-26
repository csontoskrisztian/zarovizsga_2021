<?php
//?query=baratokTabla

namespace queries;

class BaratokTabla extends \queries\ParentRekordById
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Barátok Listája";
        $this->sql = "SELECT j.id, j.online, j.felhasznalonev FROM baratok b
                        INNER JOIN jatekosok j ON j.id = b.jatekos2_id
                        WHERE b.jatekos1_id = ?
                      UNION
                      SELECT j.id, j.online, j.felhasznalonev FROM baratok b
                        INNER JOIN jatekosok j ON j.id = b.jatekos1_id
                        WHERE b.jatekos2_id = ?";
        $this->typesString = "ii";
        $this->paramVariables = [$params["id"], $params["id"]];
        $this->columns = [
            "j.id" => "id",
            "j.felhasznalonev" => "Felhasználónév",
            "j.online" => "online"
        ];
    }
}
