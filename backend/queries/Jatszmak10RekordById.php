<?php
//?query=jatszmak10RekordById

namespace queries;

class Jatszmak10RekordById extends \queries\ParentRekordById
{
  public function __construct($params)
  {
    parent::__construct($params);
    $this->title = "Legutóbbi 10 jatszma";
    $this->sql = "SELECT * FROM (
            SELECT jatszmak.id, felhasznalonev as ellenfel, jatekos1_pont as pont, jatekos2_pont as ellenfel_pont, jatekido, nehezseg FROM jatszmak
              INNER JOIN jatekosok ON jatekos2_id = jatekosok.id
              WHERE jatekos1_id = ?
            UNION ALL
            SELECT jatszmak.id, felhasznalonev as ellenfel, jatekos2_pont as pont, jatekos1_pont as ellenfel_pont, jatekido, nehezseg FROM jatszmak
              INNER JOIN jatekosok ON jatekos1_id = jatekosok.id
              WHERE jatekos2_id = ?) as tabla
              ORDER BY tabla.id DESC
            LIMIT 10;";
    $this->typesString = "ii";
    $this->paramVariables = [$params["id"], $params["id"]];
    $this->columns = [
      "jatszmak.id" => "id",
      "ellenfel" => "Ellenfél",
      "pont" => "Pontszámod",
      "ellenfel_pont" => "Ellenfél Pontszáma",
      "jatekido" => "Idő (perc)",
      "nehezseg" => "Nehézségi Szint"
    ];
  }
}
