<?php
//?query=jatekosokTop

namespace queries;

class JatekosokTop extends \queries\ParentTabla {
    public function __construct($params){
        parent::__construct($params);
        $this->title = "Toplista";
        $this->sql = "SELECT j.id, j.felhasznalonev, SUM(tbl.pont)  as 'pont' FROM
                            (SELECT id, jatekos1_id as jatekos_id,  (jatekos1_pont - jatekos2_pont) as pont FROM jatszmak
                            UNION ALL
                            SELECT id, jatekos2_id as jatekos_id, (jatekos2_pont - jatekos1_pont) as pont FROM jatszmak
                            ) as tbl
                        INNER JOIN jatekosok j ON j.id = tbl.jatekos_id
                        GROUP BY j.id
                        ORDER BY `pont` DESC
                        LIMIT 3";
        $this->columns = [
            "j.id" => "id",
            "j.felhasznalonev" => "Felhasználónév",
            "pont" => "Rangsor pontszám"
        ];
    }
}