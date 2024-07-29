<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST'){ 

    // post username and password from form
    $username = $_POST['name'];
    $password = $_POST['code'];
    
    // database info
    $host = "localhost";
    $dbname = "dbname"; 
    $dbuser = "dbuser";
    $dbpassword = "dbpassword";

    // database connection
    $dbconnection = pg_connect("host=$host dbname=$dbname user=$dbuser password=$dbpassword");
    if (!$dbconnection) {
        die("Error in connection test: " . pg_last_error());
    } 

    $authentication = false;

    // execute query for user/password
    $query = "SELECT * FROM users WHERE username = $1 AND Role = 'Admin'"; 
    $result = pg_query_params($dbconnection, $query, array($username));

    $user = pg_fetch_object($result);
    if($user && password_verify($password, $user['password'])){
        $authentication = true;        
    }

    pg_free_result($result);  

    if($authentication){
        $_SESSION['username'] = $username; // Save username to session
        header('Location: admin-display.php'); // redirect to admin display
        exit();
    }else{
        echo "Name or password not valid";    
        pg_close($dbconnection);  
    }
}
?>

<!-- TODO: sessions are NOT cleared on refresh, so remember to make a logout!!! -->
<!-- TODO: the admin should be able to add or delete users or scores -->
<!-- TODO: add an extra tab to the leaderboard that allows users to see their scores compared with all other users in their country
  or globally -->
<!-- TODO: add ability for user to sign up for an account where their email address does not yet exist (also allow users to
 reset their password) -->

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
            <button class="button" id="login-popup" onclick='show("loginScreen")'>Login</button>
        </div>
    </div>

    <!-- login popup -->
    <div class="popup-bg" id="loginScreen">
        <div class="popup">
            <div class="close-btn" onclick='hide("loginScreen")'>&#x2715;</div>
            <h1 class="popup-title">Login</h1>
            <form method="post" id="login">
                <label for="email-address" class="subtitle">Email Address</label><br>
                <input type="email" id="email-address" name="email-address" autocomplete="username" required class="text-input"><br>
                <p class="error-message">Error message</p>
                <label for="password" class="subtitle">Password</label><br>
                <input type="password" id="password" name="password" required class="text-input"><br>
                <p class="error-message">Error message</p>
                <button type="submit" class="button">Login</button>
                <a href="signup.php">
                    <h4 class="subtitle">Don't have an account? Sign up.</h4>
                </a>
            </form>
        </div>
    </div>

    <script src="index.js"></script>
</body>

</html>