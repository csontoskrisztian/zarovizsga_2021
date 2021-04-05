<?php
//?query=jatekosfelhasznalonevUpdate&id=1

namespace queries;

class JatekosFelhasznalonevUpdate extends ParentUpdate
{

    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játékos update";
        $this->sql = "UPDATE jatekosok SET
                    felhasznalonev = ?
                    WHERE id = ?";
        $this->typesString = "si";
        $this->paramVariables = [
            $params["felhasznalonev"],
            $params["id"]
        ];
        $this->columns = [];
    }
}
