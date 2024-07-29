<?php
session_start();
?>

<!-- TODO: sessions are NOT cleared on refresh, so remember to make a logout!!! -->
<!-- TODO: the admin should be able to add or delete users or scores -->
<!-- TODO: add an extra tab to the leaderboard that allows users to see their scores compared with all other users in their country
  or globally -->

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

                <h4 class="subtitle">Don't have an account? Sign up.</h4>
            </form>
        </div>
    </div>

    <script src="index.js"></script>
</body>

</html>