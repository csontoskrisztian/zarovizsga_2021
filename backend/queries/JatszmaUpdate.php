<?php
//?query=jatszmaUpdate&id=1

namespace queries;

class JatszmaUpdate extends ParentUpdate
{

    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játékos update";
        $this->sql = "UPDATE jatszmak SET
                        jatekos1_pont = ?,
                        jatekos2_pont = ?,
                        allapot = ?,
                        jatekido = ?
                    WHERE id = ?";
        $this->typesString = "iiiii";
        $this->paramVariables = [
            $params["jatekos1_pont"],
            $params["jatekos2_pont"],
            $params["allapot"],
            $params["jatekido"],
            $params["id"]
        ];
        $this->columns = [];
    }
}
