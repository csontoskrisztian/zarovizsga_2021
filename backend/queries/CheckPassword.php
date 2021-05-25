<?php
//POST
//login()
/*
query=checkPassword
id=1
password=jelszo
*/

namespace queries;

class CheckPassword {
    protected $params;
    protected $status;
    protected $title;
    protected $rows;
    protected $columns;
    protected $sql;
    protected $typesString;
    protected $paramVariables;
    protected $password;

    public function __construct($params){
        $this->params = $params;
        $this->title = "Check Password";
        $this->sql = "SELECT * FROM jatekosok
                WHERE id = ?";
        $this->typesString = "i";
        $this->paramVariables = [$params["id"]];
        $this->password = $params["jelszo"];
        $this->columns = [];
    }

    public function check(){
        $connection = (new \core\Connect())->connect();

        if ($connection) {
            if ($statement = mysqli_prepare($connection, $this->sql)) {
                // $autoId = $this->params["autoId"];
                // extract($this->params);
                mysqli_stmt_bind_param($statement, $this->typesString, ...$this->paramVariables);
                mysqli_stmt_execute($statement);
                $result = mysqli_stmt_get_result($statement);
                $record = mysqli_fetch_assoc($result);
                // print_r($record);
                // die;
                if ($record != null && password_verify($this->password, $record["jelszo"])) {
                    //password ok
                    $this->status = "Ok";
                }else{
                    //nem jó a jelszó
                    $this->status = "helytelen jelszó";
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