<?php
//POST
/*
    query=jatszmaLepesekDelete
    id=1
    jatszmakId = 1
*/
namespace queries;

class JatszmaLepesekDelete extends \queries\ParentDelete {

    public function __construct($params){
        parent::__construct($params);
        $this->title = "Játszma lépés Törlés";
        $this->sql = "DELETE FROM jatszmaLepesek
                        WHERE id = ? AND jatszmakId = ?";
        $this->typesString = "ii";
        $this->paramVariables = [
            $params["id"],
            $params["jatszmakId"]
        ];
    }
}