<?php

include './lib/DBConfig.php';

class DBService extends DBConfig
{
    /** @var mysqli $connection */
    public $connection;
    public $dataSet;
    private $sqlQuery;


    protected $userName;
    protected $passCode;

    function __construct()
    {
        parent::__construct();

        $this->connection = NULL;
        $this->sqlQuery = NULL;
        $this->dataSet = NULL;
    }

    function dbConnect()
    {
        $this->connection = new mysqli($this->serverName, $this->userName, $this->passCode, $this->dbName);
        mysqli_set_charset($this->connection, "UTF8");
        return $this->connection;
    }

    function dbDisconnect()
    {
        $this->connection = NULL;
        $this->sqlQuery = NULL;
        $this->dataSet = NULL;
        $this->dbName = NULL;
        $this->serverName = NULL;
        $this->userName = NULL;
        $this->passCode = NULL;
    }

    function selectAll($tableName)
    {
        $this->sqlQuery = 'SELECT * FROM ' . $this->dbName . '.' . $tableName;
        $this->dataSet = $this->connection->query($this->sqlQuery);
        $res = [];

        while ($joke = $this->dataSet->fetch_assoc()) {
            $res[] = $joke;
        }

        return $res;
    }

    function selectAllField($tableName, $field)
    {
        $this->sqlQuery = 'SELECT ' . $field . ' FROM ' . $this->dbName . '.' . $tableName;
        $this->dataSet = $this->connection->query($this->sqlQuery);
        $res = [];

        while ($joke = $this->dataSet->fetch_assoc()) {
            $res[] = $joke;
        }

        return $res;
    }

    function deleteByField($tableName, $field, $value)
    {
        $this->sqlQuery = 'DELETE FROM ' . $this->dbName . '.' . $tableName . ' WHERE ' . $field . ' = ' ;

        if (is_string($value)) {
            $this->sqlQuery .= "'";
            $this->sqlQuery .= mysqli_real_escape_string($this->connection, $value);
            $this->sqlQuery .= "'";
        } else if (is_int($value)) {
            $this->sqlQuery .= $value;
        }

        return $this->connection->query($this->sqlQuery);
    }

    function selectWhere($tableName, $rowName, $operator, $value, $valueType)
    {
        $this->sqlQuery = 'SELECT * FROM ' . $tableName . ' WHERE ' . $rowName . ' ' . $operator . ' ';
        if ($valueType == 'int') {
            $this->sqlQuery .= $value;
        } else if ($valueType == 'char') {
            $this->sqlQuery .= "'" . $value . "'";
        }
        $this->dataSet = $this->connection->query($this->sqlQuery);
        $this->sqlQuery = NULL;
        return $this->dataSet->fetch_assoc();
    }


    function insertInto($tableName, $cols,  $values)
    {
        $this->sqlQuery = "INSERT INTO " . $tableName . "(" . $cols . ") VALUES (";

        foreach ($values as $value) {
            if (is_string($value)) {
                $this->sqlQuery .= "'";
                $this->sqlQuery .= mysqli_real_escape_string($this->connection, $value);
                $this->sqlQuery .= "'";
            } else if (is_int($value)) {
                $this->sqlQuery .= $value;
            }

            if (!is_null($value)) {
                $this->sqlQuery .= ",";
            }
        }

        $this->sqlQuery = rtrim($this->sqlQuery, ',');
        $this->sqlQuery .= ")";
        return $this->connection->query($this->sqlQuery);
    }
}