<?php
//POST
//login()
/*
query=checkUsernameEmail
felhasznalonev=xyz
email=xyz
*/

namespace queries;

class CheckUsernameEmail {
    protected $params;
    protected $status;
    protected $title;
    protected $rows;
    protected $columns;
    protected $sql;
    protected $typesString;
    protected $paramVariables;

    public function __construct($params){
        $this->params = $params;
        $this->title = "Check Username and Email";
        $this->sql = "SELECT * FROM jatekosok
                WHERE felhasznalonev = ? OR email = ?";
        $this->typesString = "ss";
        $this->paramVariables = [$params["felhasznalonev"], $params["email"]];
        $this->columns = [];
    }

    public function check(){
        $connection = (new \core\Connect())->connect();

        if ($connection) {
            if ($statement = mysqli_prepare($connection, $this->sql)) {
                mysqli_stmt_bind_param($statement, $this->typesString, ...$this->paramVariables);
                mysqli_stmt_execute($statement);
                $result = mysqli_stmt_get_result($statement);
                if ($result->num_rows == 0) {
                    //password ok
                    $this->status = "Ok";
                }else{
                    //nem jó a jelszó
                    $this->status = "foglalt felhasználónév vagy email cím";
                }
                $this->rows = [];
            }else{
                logMessage("ERROR","query error: ".mysqli_error($connection)); 
                $this->rows = [];
                $this->status = "Query Error";
            }
        }else{
            $this->status = "Connection Error";
            $this->rows = [];
        }

        (new \core\SendDataJson($this->params,  $this->status, $this->title, $this->rows, $this->columns))->sendData();

    }


}