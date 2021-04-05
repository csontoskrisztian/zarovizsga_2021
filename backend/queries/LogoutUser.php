<?php
//logout()
//?query=logoutUser


namespace queries;

class LogoutUser {
    protected $params;
    protected $status;
    protected $title;
    protected $rows;
    protected $columns;

    public function __construct($params){
        $this->params = $params;
        $this->status = "OK";
        $this->title = "Logout";
        $this->rows = [];
        $this->columns = [];
    }

    public function logout(){
        unset($_SESSION["user"]);
        (new \core\SendDataJson($this->params,  $this->status, $this->title, $this->rows, $this->columns))->sendData();

    }
}
