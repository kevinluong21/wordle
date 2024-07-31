<?php 
session_start();

// database info
$host = "localhost";
$dbname = "wordle";

$response = [];

// database connection
$dbconnection = pg_connect("host=$host dbname=$dbname");
if (!$dbconnection) {
    die("Error in connection test: " . pg_last_error());
}

