<?php 
session_start();

// database info
$host = "localhost";
$dbname = "wordle";

$authentication = false;
$response = [];

// database connection
$dbconnection = pg_connect("host=$host dbname=$dbname");
if (!$dbconnection) {
    die("Error in connection test: " . pg_last_error());
}

//process login form

// post username and password from form
$email = $_POST['email-address'];
$password = $_POST['password'];

// execute query for user/password
$query = "SELECT * FROM Users WHERE EmailAddress = $1";
$result = pg_query_params($dbconnection, $query, array($email));

$user = pg_fetch_object($result);

if (!$user) { //table is empty meaning that email address is not in Users
    $response["email-error"] = true;
    pg_close($dbconnection);
    echo json_encode($response);
    return;
}

// if($user && password_verify($password, $user->password)){
//     $authentication = true;
// }

// check if passwords match
if ($user && $password == $user->password) {
    $authentication = true;
}

pg_free_result($result);

if ($authentication) {
    $_SESSION["emailAddress"] = $user->emailaddress; // Save email address to session
    $_SESSION["country"] = $user->country; //save the user's country to session

    if ($user->role == "Admin") {
        $response["redirect"] = "/admin_display.php"; // redirect to admin display if admin
    }
    else {
        $response["redirect"] = "/gameplay.php"; // redirect to game if player
    }
} else {
    $response["password-error"] = true;
    pg_close($dbconnection);
    echo json_encode($response);
    return;
}

header("Content-Type: application/json");
echo json_encode($response);
