<?php
//?query=jatekosJelszoUpdate&id=1

namespace queries;

class JatekosJelszoUpdate extends ParentUpdate
{

    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játékos update";
        $this->sql = "UPDATE jatekosok SET
                    jelszo = ?
                    WHERE id = ?";
        $this->typesString = "si";
        $this->paramVariables = [
            $params["jelszo"],
            $params["id"]
        ];
        $this->columns = [];
    }
}
