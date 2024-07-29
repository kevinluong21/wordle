<?php

session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // post username and password from form
    $email = $_POST['email-address'];
    $password = $_POST['password'];

    // database info
    $host = "localhost";
    $dbname = "wordle";
    // $dbuser = "dbuser";
    // $dbpassword = "dbpassword";

    // database connection
    $dbconnection = pg_connect("host=$host dbname=$dbname");
    if (!$dbconnection) {
        die("Error in connection test: " . pg_last_error());
    }

    $authentication = false;

    // execute query for user/password
    $query = "SELECT * FROM Users WHERE EmailAddress = $1";
    $result = pg_query_params($dbconnection, $query, array($email));

    $user = pg_fetch_object($result);

    if (!$user) { //table is empty meaning that email address is not in Users
        echo "Email Address does not exist";
        pg_close($dbconnection);
        exit(); //temporarily sends user to a blank page (will fix later!)
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
        $_SESSION['username'] = $email; // Save username to session

        if ($user->role == "Admin") {
            header('Location: admin_display.php'); // redirect to admin display if admin
        }
        else {
            header('Location: gameplay.php'); // redirect to player display if player
        }
        exit();
    } else {
        echo "Incorrect password"; //this needs to be displayed somewhere else!
        pg_close($dbconnection);
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="index.css" rel="stylesheet" type="text/css">
    <link rel="icon" type="image/x-icon" href="/images/jk_logo.png">
    <title>Wordle by JK</title>
</head>

<body>
    <div class="container">
        <div class="main">
            <h1 class="title">Wordle</h1>
            <h4 class="subtitle">Guess the 5-letter word in 6 tries or less.</h4>
            <a href="gameplay.php">
                <button class="button" id="play-as-guest">Play as Guest</button>
            </a>
            <button class="button" id="login" onclick='show("loginScreen")'>Login</button>
        </div>
    </div>

    <!-- login popup -->
    <div class="popup-bg" id="loginScreen">
        <div class="popup">
            <div class="close-btn" onclick='hide("loginScreen")'>&#x2715;</div>
            <h1 class="popup-title">Login</h1>
            <form method="post">
                <label for="email-address" class="subtitle">Email Address</label><br>
                <input type="email" id="email-address" name="email-address" autocomplete="username" required class="text-input"><br>
                <h4 class="subtitle">Error Message</h4>
                <label for="password" class="subtitle">Password</label><br>
                <input type="password" id="password" name="password" required class="text-input"><br>
                <h4 class="subtitle">Error Message</h4>
                <button type="submit" class="button">Login</button>

                <h4 class="subtitle">Don't have an account? Sign up.</h4>
            </form>
        </div>
    </div>

    <script src="index.js"></script>
</body>

</html>