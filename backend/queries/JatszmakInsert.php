<?php
//POST
/*
    query=jatszmakInsert
    jatekos1_id=3
    maxido=240
    nehezseg=2
    seed=123456
    kor=1
*/

namespace queries;

class JatszmakInsert extends \queries\ParentInsert
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játszmák hozzáfűzés";
        $this->sql = "INSERT INTO jatszmak 
                        (jatekos1_id, maxido, nehezseg, seed, kor)
                        VALUE (?, ?, ?, ?, ?)";
        $this->typesString = "iiiii";
        $this->paramVariables = [
            $params["jatekos1_id"],
            $params["maxido"],
            $params["nehezseg"],
            $params["seed"],
            $params["jatekos1_id"]
        ];
    }
}
