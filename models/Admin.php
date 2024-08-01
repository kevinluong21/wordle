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

function getUsers() {
    global $dbconnection;

    // return the users table
    $query = "SELECT * FROM Users";
    $usersTable = pg_query($dbconnection, $query);

    $users = [];

    while ($row = pg_fetch_assoc($usersTable)) {
        $user = [];
        $user['nickname'] =  htmlspecialchars($row['nickname']);
        $user['emailaddress'] = htmlspecialchars($row['emailaddress']);
        $user['password'] = htmlspecialchars($row['password']);
        $user['country'] = htmlspecialchars($row['country']);
        $user['role'] = htmlspecialchars($row['role']);
        $users[] = $user;
    }

    pg_free_result($usersTable);

    return $users;
}

function getScores() {
    global $dbconnection;

    //return a table of all correct words played by users
    $query = "SELECT DISTINCT CorrectWord FROM Scores ORDER BY CorrectWord ASC";
    $correctWordsTable = pg_query($dbconnection, $query);

    $words = [];

    while ($row = pg_fetch_assoc($correctWordsTable)) {
        $words[] = $row["correctword"];
    }

    pg_free_result($correctWordsTable);

    $scores = [];

    foreach ($words as $word) {
        // return the scores table for each correct word
        $query = "SELECT Scores.ScoreID, Users.Nickname, Scores.EmailAddress, Users.Country, Scores.CorrectWord, Scores.NumAttempts FROM Scores JOIN Users ON Scores.EmailAddress = Users.EmailAddress WHERE Scores.CorrectWord = $1 ORDER BY Scores.NumAttempts, Scores.ScoreID ASC";
        $scoresTable = pg_query_params($dbconnection, $query, [$word]);

        $scores[] = pg_fetch_all($scoresTable);

        pg_free_result($scoresTable);
    }

    return $scores;
}

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

    pg_free_result($result);

    echo json_encode($response);
    return;
}

if (isset($_POST["action"]) && $_POST["action"] == "update") {
    $response["users"] = getUsers();
    $response["scores"] = getScores();

    echo json_encode($response);
    return;
}
