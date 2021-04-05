<?php
namespace queries;

class ParentTabla {
    protected $params;
    protected $status;
    protected $title;
    protected $rows;
    protected $columns = [];
    protected $sql;

    public function __construct($params){
        $this->params = $params;
    }

    public function render(){
        $connection = (new \core\Connect())->connect();

        if ($connection) {
            if ($statement = mysqli_prepare($connection, $this->sql)) {
                mysqli_stmt_execute($statement);
                $result = mysqli_stmt_get_result($statement);
                $this->rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
                $this->status = "Ok";
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