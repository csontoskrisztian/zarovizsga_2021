<?php
//logout()
//?query=logoutUser


namespace queries;

class GetUser {
    protected $params;
    protected $status;
    protected $title;
    protected $rows;
    protected $columns;

    public function __construct($params){
        $this->params = $params;
        $this->status = "OK";
        $this->title = "Get user";
        $this->rows = [];
        $this->columns = [];
    }

    public function getUser(){
        (new \core\SendDataJson($this->params,  $this->status, $this->title, $this->rows, $this->columns))->sendData();
    }
}
