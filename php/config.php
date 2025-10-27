<?php 
$HOST = "localhost";
$USER_NAME = "root";
$PASSWORD = "";
$DB_NAME = "e_library"; 
$conn = new mysqli($HOST, $USER_NAME, $PASSWORD, $DB_NAME);
$conn->set_charset("utf8mb4");
?>