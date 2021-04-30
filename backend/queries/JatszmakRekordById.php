<?php
//?query=jatszmakRekordById

namespace queries;

class JatszmakRekordById extends \queries\ParentRekordById
{
    public function __construct($params)
    {
        parent::__construct($params);
        $this->title = "Keresett játékos";
        $this->sql = "SELECT * FROM (
            SELECT jatszmak.id, felhasznalonev as ellenfel, jatekos1_pont as pont, jatekos2_pont as ellenfel_pont, jatekido, nehezseg FROM jatszmak
              INNER JOIN jatekosok ON jatekos2_id = jatekosok.id
              WHERE jatekos1_id = ?
            UNION ALL
            SELECT jatszmak.id, felhasznalonev as ellenfel, jatekos2_pont as pont, jatekos1_pont as ellenfel_pont, jatekido, nehezseg FROM jatszmak
              INNER JOIN jatekosok ON jatekos1_id = jatekosok.id
              WHERE jatekos2_id = ?) as tabla
            LIMIT 10;";
        $this->typesString = "ii";
        $this->paramVariables = [$params["id"], $params["id"]];
        $this->columns = [
            "jatszmak.id" => "id",
            "ellenfel" => "Ellenfél",
            "pont" => "Pontszámod",
            "ellenfel_pont" => "Ellenfél Pontszáma",
            "jatekido" => "Idő",
            "nehezseg" => "Nehézségi Szint"
        ];
    }
}
