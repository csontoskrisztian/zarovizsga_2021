<?php
//?query=jatekosPontszam

namespace queries;

class JatekosPontszam extends \queries\ParentRekordById {
    public function __construct($params){
        parent::__construct($params);
        $this->title = "Játékos pontszám";
        $this->sql = "SELECT SUM(tbl.pont) as 'Rangsor pontszám' FROM
                            (SELECT jatekos1_id as jatekos_id, (jatekos1_pont - jatekos2_pont) as pont FROM jatszmak
                                UNION ALL
                            SELECT jatekos2_id as jatekos_id, (jatekos2_pont - jatekos1_pont) as pont FROM jatszmak
                            ) as tbl
                        WHERE tbl.jatekos_id = ?
                        GROUP BY tbl.jatekos_id;";
        $this->typesString = "i";
        $this->paramVariables = [$params["id"]];
        $this->columns = [
            "pont" => "Rangsor pontszám"
        ];
    }
}
