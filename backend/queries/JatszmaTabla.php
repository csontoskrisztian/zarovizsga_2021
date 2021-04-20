<?php
//?query=jatszmaTabla

namespace queries;

class JatszmaTabla extends \queries\ParentTabla {
    public function __construct($params){
        parent::__construct($params);
        $this->title = "Játszma_0";
        $this->sql = "SELECT * FROM jatszma_0";
        $this->columns = [
            "X" => "X koorditána",
            "Y" => "Y koordináta",
            "csempeid" => "Csempe ID"
        ];
    }
}
