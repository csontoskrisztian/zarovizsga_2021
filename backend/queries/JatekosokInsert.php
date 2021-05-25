<?php
//POST
/*
    query=jatekosokInsert
    email=valami@valami.hu
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
        $this->sql = "INSERT INTO jatekosok (email, felhasznalonev, jelszo)
                        VALUE (?, ?, ?)";
        $this->typesString = "sss";
        $this->paramVariables = [
            $params["email"],
            $params["felhasznalonev"],
            password_hash($params["jelszo"], PASSWORD_BCRYPT)
        ];
    }
}
