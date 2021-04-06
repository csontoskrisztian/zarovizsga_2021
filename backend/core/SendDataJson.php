<?php

namespace core;

class SendDataJson
{
    private $params;
    private $status;
    private $rows;
    private $data;
    private $title;
    private $version;
    private $columns;
    private $loginAccessLevel;
    private $loginUserName;
    private $loginId;

    public function __construct(array $params, string $status, string $title = "", array $rows = [], array $columns = [])
    {
        $this->params = $params;
        $this->status = $status;
        $this->title = $title;
        $this->rows = $rows;
        $this->columns = $columns;
        $this->loginStatus();
        $this->data = [
            "version" => "2.0",
            "params" => $this->params,
            "loginAccessLevel" => $this->loginAccessLevel,
            "loginUserName" => $this->loginUserName,
            "loginId" => $this->loginId,
            "status" => $this->status,
            "title" => $this->title,
            "columns" => $this->columns,
            "rows" => $this->rows
        ];
    }

    //A bejelentkezés állapotának kódja
    //0: senki nincs bejelentkezve
    //1: admin van bejelentkezve
    //2: guest van bejelentkezve
    public function loginStatus()
    {
        $status = 0;
        $user = "";
        $id = 0;
        if (isset($_SESSION["user"])) {
            $userName = $_SESSION["user"];
            $sql = "SELECT * FROM jatekosok
                WHERE felhasznalonev = ?";
            $connection = (new \core\Connect())->connect();
            if ($statement = mysqli_prepare($connection, $sql)) {
                mysqli_stmt_bind_param($statement, "s", $userName);
                mysqli_stmt_execute($statement);
                $result = mysqli_stmt_get_result($statement);
                $record = mysqli_fetch_assoc($result);


                if ($record != null && $userName == $record["felhasznalonev"]) {
                    //email, password ok
                    $status = 1;
                    $id = $record["id"];
                    $user = $record["felhasznalonev"];
                } else {
                    //nincs ilyen email, vagy nem jó a jelszó
                    $status = 0;
                }
            }
        }
        $this->loginAccessLevel = $status;
        // $this->loginUserName = $user;
        $this->loginUserName = $_SESSION["user"];
        $this->loginId = $id;
    }


    public function sendData()
    {
        ob_start();
        header('Access-Control-Allow-Origin: *');

        //cors
        // header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        // header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, HEAD, OPTIONS');
        // header("Access-Control-Allow-Headers: X-Requested-With");

        // header('Access-Control-Allow-Credentials: true');
        // header('Access-Control-Max-Age: 86400');    // cache for 1 day

        //--------
        // $this->cors();

        header('Content-type: application/json; charset=utf-8');
        ob_clean();


        print json_encode($this->data, JSON_PRETTY_PRINT + JSON_UNESCAPED_UNICODE);
    }

    /**
     *  An example CORS-compliant method.  It will allow any GET, POST, or OPTIONS requests from any
     *  origin.
     *
     *  In a production environment, you probably want to be more restrictive, but this gives you
     *  the general idea of what is involved.  For the nitty-gritty low-down, read:
     *
     *  - https://developer.mozilla.org/en/HTTP_access_control
     *  - https://fetch.spec.whatwg.org/#http-cors-protocol
     *
     */
    public function cors()
    {

        // Allow from any origin
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
            // you want to allow, and if so:
            header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Max-Age: 86400');    // cache for 1 day
        }

        // Access-Control headers are received during OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
                // may also be using PUT, PATCH, HEAD etc
                header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

            if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
                header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

            exit(0);
        }

        // echo "You have CORS!";
    }
}
