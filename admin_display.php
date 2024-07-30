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
$correctWords = pg_query($dbconnection, $query);

$words = [];

while ($row = pg_fetch_assoc($correctWords)) {
    $words[] = $row["correctword"];
}

// return the users table
$query = "SELECT * FROM Users";
$users = pg_query($dbconnection, $query);

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
            $query = "SELECT * FROM Scores WHERE CorrectWord = $1 ORDER BY NumAttempts, ID ASC";
            $scores = pg_query_params($dbconnection, $query, [$word]);

            echo "<div id='" . htmlspecialchars($word) . "' class='tab-content'>";
            echo <<< SCORES
                <table class="scores-table">
                <thead>
                    <tr>
                        <th>ID</th>
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
                echo "<td>" . htmlspecialchars($row['id']) . "</td>";
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
<button class="button">Add User</button>
<table class="users-table">
        <thead>
            <tr>
                <th>Email Address</th>
                <th>Password</th>
                <th>Country</th>
                <th>Role</th>
                <th>Actions</th>
            </tr>
        </thead>
    <tbody>
        <?php
        while ($row = pg_fetch_assoc($users)) {
            echo "<tr>";
            echo "<td>" . htmlspecialchars($row['emailaddress']) . "</td>";
            echo "<td>" . htmlspecialchars($row['password']) . "</td>";
            echo "<td>" . htmlspecialchars($row['country']) . "</td>";
            echo "<td>" . htmlspecialchars($row['role']) . "</td>";
            echo "<td><button>Modify</button><button>Remove</button></td>";
            echo "</tr>";
        }
        ?>
    </tbody>
</table>
</body>
</html>