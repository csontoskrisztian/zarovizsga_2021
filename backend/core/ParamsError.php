<?php
namespace core;

class ParamsError{
    private $params;
    private $status;
    private $title;
    private $rows;
    private $columns;

    public function __construct($params){
        $this->params = $params;
        $this->status = "Params error";
        $this->title = "Hibás paraméter";
        $this->rows = [];
        $this->columns = [];
    }

    public function render(){
        
        (new \core\SendDataJson($this->params,  $this->status, $this->title, $this->rows, $this->columns))->sendData();
    }
}