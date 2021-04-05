<?php
namespace core;

class App {
    public function start(){

        
        
        
        $params = [];
        if (count($_GET)>0) {
            $params = $_GET;
        }else{
            $json = file_get_contents('php://input');
            if($this->is_Json($json)){
                // print "json";
                // die;
                $params = json_decode($json,true);
            }else{
                // print "no json";
                // die;
                $params = $_POST;
            }    
        }    
        

        if(!is_array( $params)){
            $params = [];
        }
        



        // if (count($_POST)>0) {
        //     $_POST = json_decode(array_keys($_POST)[0], true);
        //     $params = $_POST;
        // }

     
        $query = $params["query"] ?? "";

        
        $services = (include "services.php");
        if (!array_key_exists($query, $services)){
            $query = "paramsError";
        }
        
        // print $query;
        // die;


        $services[$query]($params);
    }

    public function is_Json($string) {
        json_decode($string);
        return (json_last_error() == JSON_ERROR_NONE);
    }
}