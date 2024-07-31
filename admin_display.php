<?php 

session_start();

$host = "localhost";
$dbname = "wordle";

// database connection
$dbconnection = pg_connect("host=$host dbname=$dbname");
if (!$dbconnection) {
    die("Error in connection test: " . pg_last_error());
}

// // return the scores table
// $query = "SELECT * FROM Scores";
// $scores = pg_query($dbconnection, $query);

//return a table of all correct words played by users
$query = "SELECT DISTINCT CorrectWord FROM Scores ORDER BY CorrectWord ASC";
$correctWordsTable = pg_query($dbconnection, $query);

$words = [];

while ($row = pg_fetch_assoc($correctWordsTable)) {
    $words[] = $row["correctword"];
}

pg_free_result($correctWordsTable);

// return the users table
$query = "SELECT * FROM Users";
$usersTable = pg_query($dbconnection, $query);

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

    <h1>Leaderboard By Correct Word</h1>
    <div class="tabs">
        <?php 
            foreach ($words as $word) {
                echo "<button class='button'>" . htmlspecialchars($word) . "</button>";
            }
        ?>
    </div>

    <?php 
        foreach ($words as $word) {
            // return the scores table for each correct word
            $query = "SELECT Scores.ScoreID, Users.Nickname, Scores.EmailAddress, Users.Country, Scores.CorrectWord, Scores.NumAttempts FROM Scores JOIN Users ON Scores.EmailAddress = Users.EmailAddress WHERE Scores.CorrectWord = $1 ORDER BY Scores.NumAttempts, Scores.ScoreID ASC";
            $scores = pg_query_params($dbconnection, $query, [$word]);

            echo "<div id='" . htmlspecialchars($word) . "' class='tab-content'>";
            echo <<< SCORES
                <table class="scores-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nickname</th>
                        <th>Email Address</th>
                        <th>Country</th>
                        <th>Correct Word</th>
                        <th>Number of Attempts</th>
                    </tr>
                </thead>
                <tbody>
                SCORES;
            
            while ($row = pg_fetch_assoc($scores)) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row['scoreid']) . "</td>";
                echo "<td>" . htmlspecialchars($row['nickname']) . "</td>";
                echo "<td>" . htmlspecialchars($row['emailaddress']) . "</td>";
                echo "<td>" . htmlspecialchars($row['country']) . "</td>";
                echo "<td>" . htmlspecialchars($row['correctword']) . "</td>";
                echo "<td>" . htmlspecialchars($row['numattempts']) . "</td>";
                echo "</tr>";
            }

            echo <<< SCORES
                </tbody>
            </table>
            SCORES;
            echo "</div>";
        }
    ?>

<h1>List of Users</h1>
<button class="button" id="add-user-popup" onclick='show("addUserScreen")'>Add User</button>
<button class="button" id="delete-user-popup" onclick='show("deleteUserScreen")'>Delete User</button>
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
    <tbody>
        <?php
        while ($row = pg_fetch_assoc($usersTable)) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($row['nickname']) . "</td>";
            echo "<td>" . htmlspecialchars($row['emailaddress']) . "</td>";
            echo "<td>" . htmlspecialchars($row['password']) . "</td>";
            echo "<td>" . htmlspecialchars($row['country']) . "</td>";
            echo "<td>" . htmlspecialchars($row['role']) . "</td>";
            echo "<td><button>Modify</button><button>Remove</button></td>";
            echo "</tr>";
        }

        pg_free_result($usersTable);
        ?>
    </tbody>
</table>

<!-- add user popup -->
<div class="popup-bg" id="addUserPopup">
    <div class="popup">
        <div class="close-btn" onclick='hide("addUserScreen")'>&#x2715;</div>
        <h1 class="popup-title">Add User</h1>
        <form method="post" id="addUser">
            <label for="email-address-add" class="subtitle">Email Address</label><br>
            <input type="email" id="email-address-add" name="email-address" autocomplete="username" required class="text-input"><br>
            <p class="error-message">Error message</p>
            <label for="password-add" class="subtitle">Password</label><br>
            <input type="password" id="password-add" name="password" required class="text-input"><br>
            <p class="error-message">Error message</p>
            <button type="submit" class="button">Add User</button>
        </form>
    </div>
</div>

<!-- delete user popup -->
<div class="popup-bg" id="deleteUserPopup">
    <div class="popup">
        <div class="close-btn" onclick='hide("deleteUserScreen")'>&#x2715;</div>
        <h1 class="popup-title">Delete User</h1>
        <form method="post" id="deleteUser">
            <label for="email-address-delete" class="subtitle">Email Address</label><br>
            <input type="email" id="email-address-delete" name="email-address" autocomplete="username" required class="text-input"><br>
            <p class="error-message">Error message</p>
            <button type="submit" class="button">Delete User</button>
        </form>
    </div>
</div>

<script src="admin_display.js"></script>
</body>
</html>