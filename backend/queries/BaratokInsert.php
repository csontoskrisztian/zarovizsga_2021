<?php
//POST
/*
    query=baratokInsert
    jatekos1_id=1
    jatekos2_id=1
*/
namespace queries;

class BaratokInsert extends \queries\ParentInsert {

    public function __construct($params){
        parent::__construct($params);
        $this->title = "Barát hozzáfűzés";
        $this->sql = "INSERT INTO baratok
                        (jatekos1_id, jatekos2_id)
                        VALUE (?, ?)";
        $this->typesString = "ii";
        $this->paramVariables = [
            $params["jatekos1_id"],
            $params["jatekos2_id"]
        ];
    }
}