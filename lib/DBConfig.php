<?php

class DBConfig
{
    protected $serverName;
    protected $userName;
    protected $passCode;
    protected $dbName;

    function __construct() {
        $this->serverName = '127.0.0.1';
        $this->userName = 'root';
        $this->passCode = 'root';
        $this->dbName = 'joke';
    }
}
