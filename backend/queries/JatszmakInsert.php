<?php
//POST
/*
    query=jatszmakInsert
    jatekos1_id=3
    jatekos2_id=1
    maxido=240
    nehezseg=2
*/

namespace queries;

class JatszmakInsert extends \queries\ParentInsert
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játékos hozzáfűzés";
        $this->sql = "INSERT INTO jatszmak 
                        (jatekos1_id, jatekos2_id, jatekos1_pont, jatekos2_pont, allapot, jatekido, maxido, nehezseg)
                        VALUE (?, ?, 0, 0, 1, 0, ?, ?)";
        $this->typesString = "iiii";
        $this->paramVariables = [
            $params["jatekos1_id"],
            $params["jatekos2_id"],
            $params["maxido"],
            $params["nehezseg"]
        ];
    }
}
