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
                    felhasznalonev = 'Törölt felhasználó', jelszo = null
                    WHERE id = ?";
        $this->typesString = "i";
        $this->paramVariables = [
            $params["id"]
        ];
        $this->columns = [];
    }
}
