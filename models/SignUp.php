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

//process login form

// post username and password from form
$nickname = $_POST['nickname'];
$email = $_POST['email-address'];
$password = $_POST['password'];
$country = $_POST['country'];

// execute query for user/password
$query = "SELECT COUNT(*) FROM Users WHERE EmailAddress = $1";
$result = pg_query_params($dbconnection, $query, array($email));

$count = pg_fetch_assoc($result);
$count = (int)$count["count"];

if ($count != 0) { //table is not empty meaning that there was another account with this email
    $response["email-error"] = true;
    pg_close($dbconnection);
    echo json_encode($response);
    return;
}

//password must be between 8 and 20 characters
if (strlen($password) < 8 || strlen($password) > 20) {
    $response["password-error"] = true;
    pg_close($dbconnection);
    echo json_encode($response);
    return;
}

pg_free_result($result);

//insert user into database
$query = "INSERT INTO Users (Nickname, EmailAddress, Password, Country) VALUES ($1, $2, $3, $4)";
pg_query_params($dbconnection, $query, [$nickname, $email, $password, $country]);

$_SESSION["emailAddress"] = $email; // Save email address to session

$response["redirect"] = "/gameplay.php"; // redirect to game

header("Content-Type: application/json");
echo json_encode($response);