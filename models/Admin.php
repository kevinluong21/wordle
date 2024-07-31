<?php 
session_start();

header("Content-Type: application/json");

// database info
$host = "localhost";
$dbname = "wordle";

$response = [];

// database connection
$dbconnection = pg_connect("host=$host dbname=$dbname");
if (!$dbconnection) {
    die("Error in connection test: " . pg_last_error());
}

// //return a table of all correct words played by users
// $query = "SELECT DISTINCT CorrectWord FROM Scores ORDER BY CorrectWord ASC";
// $correctWordsTable = pg_query($dbconnection, $query);

// $words = [];

// while ($row = pg_fetch_assoc($correctWordsTable)) {
//     $words[] = $row["correctword"];
// }

// pg_free_result($correctWordsTable);

if (isset($_POST["action"]) && $_POST["action"] == "removeUser" && isset($_POST["emailAddress"])) {
    $emailAddress = $_POST["emailAddress"];

    $query = "DELETE FROM Users WHERE EmailAddress = $1";
    $result = pg_query_params($dbconnection, $query, [$emailAddress]);

    if (!$result) { //error executing query
        $response["remove-error"] = true;
    }
    else {
        $response["remove-error"] = false;
    }
}

if (isset($_POST["action"]) && $_POST["action"] == "getUsers") {
    // return the users table
    $query = "SELECT * FROM Users";
    $usersTable = pg_query($dbconnection, $query);
}

echo json_encode($response);
