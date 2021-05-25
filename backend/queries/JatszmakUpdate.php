<?php
//?query=jatszmakUpdate&id=1

namespace queries;

class JatszmakUpdate extends ParentUpdate
{

    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játszmák update";
        $this->sql = "UPDATE jatszmak SET
                        jatekos2_id = ?,
                        jatekos1_pont = ?,
                        jatekos2_pont = ?,
                        allapot = ?,
                        jatekido = ?,
                        kor = ?
                    WHERE id = ?";
        $this->typesString = "iiiiiii";
        $this->paramVariables = [
            $params["jatekos2_id"],
            $params["jatekos1_pont"],
            $params["jatekos2_pont"],
            $params["allapot"],
            $params["jatekido"],
            $params["kor"],
            $params["id"]
        ];
        $this->columns = [];
    }
}
