<?php
//?query=jatekosTorlesUpdate&id=1

namespace queries;

class JatekosTorlesUpdate extends ParentUpdate
{

    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játékos update";
        $this->sql = "UPDATE jatekosok SET
                    felhasznalonev = DEFAULT(felhasznalonev), jelszo = null, email = null, profilkep = DEFAULT(profilkep)
                    WHERE id = ?";
        $this->typesString = "i";
        $this->paramVariables = [
            $params["id"]
        ];
        $this->columns = [];
    }
}
