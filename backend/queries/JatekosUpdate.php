<?php
//?query=jatekosUpdate&id=1

namespace queries;

class JatekosUpdate extends ParentUpdate
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játékos update";
        $this->sql = "UPDATE jatekosok SET
                        felhasznalonev = ?, email = ?
                        WHERE id = ?";
        $this->typesString = "ssi";
        $this->paramVariables = [
            $params["felhasznalonev"],
            $params["email"],
            $params["id"]
        ];
        $this->columns = [];
    }
}
