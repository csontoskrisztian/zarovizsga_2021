<?php
//POST
/*
    query=jatszmaLepesekInsert
    jatszmakId=1
    selected1_X=0
    selected1_Y=0
    selected2_X=0
    selected2_Y=1
*/

namespace queries;

class JatszmaLepesekInsert extends \queries\ParentInsert
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játszmák hozzáfűzés";
        $this->sql = "INSERT INTO jatszmaLepesek 
                        (jatszmakId, selected1_X, selected1_Y, selected2_X, selected2_Y)
                         VALUES (?, ?, ?, ?, ?)";
        $this->typesString = "iiiii";
        $this->paramVariables = [
            $params["jatszmakId"],
            $params["selected1_X"],
            $params["selected1_Y"],
            $params["selected2_X"],
            $params["selected2_Y"]
        ];
    }
}
