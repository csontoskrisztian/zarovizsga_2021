<?php
//POST
/*
    query=baratokDelete
    jatekos1_id=1
    jatekos2_id=2
*/
namespace queries;

class BaratokDelete extends \queries\ParentDelete {

    public function __construct($params){
        parent::__construct($params);
        $this->title = "Barát Törlés";
        $this->sql = "DELETE FROM baratok
                        WHERE (jatekos1_id = ? AND jatekos2_id = ?) OR (jatekos2_id = ? AND jatekos1_id = ?)";
        $this->typesString = "iiii";
        $this->paramVariables = [
            $params["jatekos1_id"],
            $params["jatekos2_id"],
            $params["jatekos2_id"],
            $params["jatekos1_id"],
        ];
    }
}