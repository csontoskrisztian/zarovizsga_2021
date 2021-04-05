<?php
//?query=jatekosPontszam

namespace queries;

class JatekosPontszam extends \queries\ParentRekordById {
    public function __construct($params){
        parent::__construct($params);
        $this->title = "Játékos pontszám";
        $this->sql = "SELECT SUM(tbl.pont) as pont FROM
                                            (SELECT (jatekos1_pont - jatekos2_pont) as pont FROM jatszmak
                                                WHERE jatekos1_id = ?
                                            UNION
                                            SELECT (jatekos2_pont - jatekos1_pont) as pont FROM jatszmak
                                                WHERE jatekos2_id = ?) as tbl";
        $this->typesString = "ii";
        $this->paramVariables = [$params["id"], $params["id"]];
        $this->columns = [
            "pont" => "Rangsor pontszám"
        ];
    }
}
