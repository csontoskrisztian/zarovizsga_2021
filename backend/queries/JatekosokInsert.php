<?php
//POST
/*
    query=jatekosokInsert
    felhasznalonev=valami
    jelszo=$2y$10$Gjbpdkwhqas0krj8nodAHebohlpWv9/WTc0UBjoimtrlUx4B6LJoW
*/

namespace queries;

class JatekosokInsert extends \queries\ParentInsert
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Játékos hozzáfűzés";
        $this->sql = "INSERT INTO jatekosok
                        (felhasznalonev, jelszo)
                        VALUE (?, ?)";
        $this->typesString = "ss";
        $this->paramVariables = [
            $params["felhasznalonev"],
            $params["jelszo"]
        ];
    }
}
