<?php
//POST
//login()
/*
query=checkUsernameEmail
felhasznalonev=xyz
email=xyz
*/

namespace queries;

class CheckUsernameEmail
{
    protected $params;
    protected $status;
    protected $title;
    protected $rows;
    protected $columns;
    protected $sql;
    protected $typesString;
    protected $paramVariables;

    public function __construct($params) // Konstruktor
    {
        $this->params = $params; // Megadott paraméterek
        $this->title = "Felhasználónév és email ellenőrzés"; // Cím
        $this->sql = "SELECT * FROM jatekosok WHERE felhasznalonev = ? OR email = ?"; // SQL parancs
        $this->typesString = "ss"; // Várt típusai a paramétereknek (s = string)
        $this->paramVariables = [$params["felhasznalonev"], $params["email"]]; // Várt paraméterek nevei
        $this->columns = []; // Oszlop neveket tartalmazó tömb, amit ebben az esetben nem használunk
    }

    public function check()
    {
        $connection = (new \core\Connect())->connect(); //Kapcsolódás az adatbázishoz

        if ($connection) {
            // Sikeres kapcsolódás esetén ellenőrizzük az SQL parancs helyességét
            if ($statement = mysqli_prepare($connection, $this->sql)) {
                // Helyes SQl parancs esetén hozzáfűzzük a paramétereket
                mysqli_stmt_bind_param($statement, $this->typesString, ...$this->paramVariables);
                // És lefuttatjuk a parancsot
                mysqli_stmt_execute($statement);
                // Eltároljuk, hogy mi a parncsunk eredménye
                $result = mysqli_stmt_get_result($statement);
                if ($result->num_rows == 0) {
                    // Ha nem jön vissza egy értek sem, akkor sem a felhasználónév sem az email cím nem foglalt
                    // A státuszunk "Ok" lesz
                    $this->status = "Ok";
                } else {
                    // Ha visszajön egy rekord, akkor vagy a felhasználónév vagy az email cím foglalt
                    $this->status = "Foglalt felhasználónév vagy email cím";
                }
                $this->rows = [];
            } else {
                // Helytelen SQl parancs
                logMessage("ERROR", "query error: " . mysqli_error($connection));
                $this->rows = [];
                $this->status = "Query Error";
            }
        } else {
            // Nem tudott kapcsolódni az adatbázishoz
            $this->status = "Connection Error";
            $this->rows = [];
        }

        // Adatok visszaküldése a frontend-re
        (new \core\SendDataJson($this->params,  $this->status, $this->title, $this->rows, $this->columns))->sendData();
    }
}
