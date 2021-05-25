<?php
//POST
/*
    query=jatszmakDelete
    id=1
*/
namespace queries;

class jatszmakDelete extends \queries\ParentDelete {

    public function __construct($params){
        parent::__construct($params);
        $this->title = "Játszma Törlés";
        $this->sql = "DELETE FROM jatszmak
                        WHERE id = ?";
        $this->typesString = "i";
        $this->paramVariables = [
            $params["id"]
        ];
    }
}