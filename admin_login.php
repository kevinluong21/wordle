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
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="style.css" rel="stylesheet" type="text/css">
    <link rel="icon" type="image/x-icon" href="/images/jk_logo.png">
    <title>Wordle by JK</title>
</head>
<body>
    <div class="container">
        <h1 class="title">Wordle</h1>
        <h4 class="title">
            Login As An Admin
        </h4>
        <h4 class="subtitle">
            Login using your admin username and password. <br>
        </h4>
        <form method="post">
            <label for="name">Full Name</label><br>
            <input type="text" id="name" name="name" autocomplete="name" required><br>
            <label for="code">3-Character Code</label><br>
            <input type="password" id="code" name="code" size="3" minlength="3" maxlength="3" required><br>
            <button type="submit">Login</button>
        </form>
    </div>
</body>