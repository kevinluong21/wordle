<?php 
session_start();
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

    <h1>Leaderboard By Correct Word</h1>
    <div class="tabs">
    </div>

<h1>List of Users</h1>
<button class="button">Add User</button>

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
</table>
<script src="admin_display.js"></script>
</body>
</html>