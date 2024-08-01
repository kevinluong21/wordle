<?php
session_start();

//prevent users who are not admin to access this page
if (!isset($_SESSION["emailAddress"]) || $_SESSION["emailAddress"] != "admin@wordle.com") {
    header("Location: index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="admin_display.css" rel="stylesheet" type="text/css">
    <link rel="icon" type="image/x-icon" href="/images/jk_logo.png">
    <title>Wordle by JK</title>
</head>

<body>
    <div class="menu">
        <h1 class="title">Wordle</h1>
        <div class="helpButtons">
            <button class="helpButton" onclick="logout()">&#x21AA; Logout</button>
        </div>
    </div>

    <div class="dialog">
        <p class="message"></p>
    </div>

    <h1 class="heading">Leaderboard By Correct Word</h1>
    <div class="tabs">
        <div class="tab-content"></div>
    </div>

    <h1 class="heading">List of Users</h1>
    <button class="button" onclick="addUser()">Add</button>

    <form method="post" id="add-user">
        <table class="users-table">
            <thead>
                <tr>
                    <th>Nickname</th>
                    <th>Email Address</th>
                    <th>Password</th>
                    <th>Country</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody class="users">
            </tbody>
        </table>
    </form>

    <script src="admin_display.js"></script>
</body>

</html>