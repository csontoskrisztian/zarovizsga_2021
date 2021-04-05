<?php

namespace queries;

class ParentInsert{
    protected $params;
    protected $status;
    protected $title;
    protected $rows;
    protected $sql;
    protected $typesString;
    protected $paramVariables;
    protected $columns = [];

    public function __construct($params){
        $this->params = $params;
    }

    public function render(){
        $connection = (new \core\Connect())->connect();
        if ($connection) {
            if ($statement = mysqli_prepare($connection, $this->sql)) {
                // $autoId = $this->params["autoId"];
                // extract($this->params);
                mysqli_stmt_bind_param($statement, $this->typesString, ...$this->paramVariables);
                mysqli_stmt_execute($statement);
                $id = mysqli_stmt_insert_id($statement);
                $this->rows = ["id" => $id];
                $this->status = mysqli_stmt_affected_rows($statement) >0 ? "Ok": "Ok, line 0 inserted";
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