<?php 

session_start();

$host = "localhost";
$dbname = "wordle";

// database connection
$dbconnection = pg_connect("host=$host dbname=$dbname");
if (!$dbconnection) {
    die("Error in connection test: " . pg_last_error());
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="gameplay.css" rel="stylesheet" type="text/css">
    <link rel="icon" type="image/x-icon" href="/images/jk_logo.png">
    <title>Wordle by JK</title>
</head>
<body>
    <div class="container">
        <h1 class="title">Wordle</h1>
        </h1>
        <table class="admin-table">
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
            <?php
            // return the scores table
            $query = "SELECT * FROM Scores";
            $scores = pg_query($dbconnection, $query);

            while ($row = pg_fetch_assoc($scores)) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($row['id']) . "</td>";
                echo "<td>" . htmlspecialchars($row['emailaddress']) . "</td>";
                echo "<td>" . htmlspecialchars($row['country']) . "</td>";
                echo "<td>" . htmlspecialchars($row['correctword']) . "</td>";
                echo "<td>" . htmlspecialchars($row['numattempts']) . "</td>";
                echo "</tr>";
            }
            ?>
        </tbody>
    </table>
    </div>
</body>
</html>