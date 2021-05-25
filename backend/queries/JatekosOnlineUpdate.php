<?php
//?query=jatekosOnlineUpdate&id=1

namespace queries;

class JatekosOnlineUpdate extends ParentUpdate
{

    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játékos update";
        $this->sql = "UPDATE jatekosok SET
                    online = ?
                    WHERE id = ?";
        $this->typesString = "ii";
        $this->paramVariables = [
            $params["online"],
            $params["id"]
        ];
        $this->columns = [];
    }
}