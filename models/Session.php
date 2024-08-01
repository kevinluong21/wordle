<?php 
header("Content-Type: application/json");
require "Game.php";

session_start();

use Wordle\Game;

// database info
$host = "localhost";
$dbname = "wordle";

// database connection
$dbconnection = pg_connect("host=$host dbname=$dbname");
if (!$dbconnection) {
    die("Error in connection test: " . pg_last_error());
}

//Datamuse API is used to check whether the input is an actual word.
//The API can be found at https://www.datamuse.com/api/
function isWord($guess) {
    $url = "https://api.datamuse.com/words?sp=" . $guess;

    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $words = curl_exec($curl);

    if (!curl_errno($curl) && $words) { 
        curl_close($curl);
        $words = json_decode($words);

        $matches = array_filter($words, function($item) use ($guess) {
            return $item->word == strtolower($guess);
        });

        if ($matches) { //if guess is found in the list of words, then it is valid
            return true;
        }
        else {
            return false;
        }
    }
    else { //false on failure
        //if there's an API failure, simply accept the guess
        //the player may waste turns if they have a spelling mistake but it will avoid crashes if the API does not work
        curl_close($curl);
        return true;
    }
}

if (!isset($_SESSION["game"])) {
    $response["error"] = "Error loading game. Please try again.";
}

function displayGames() {
    global $dbconnection;
    $toReturn = [];

    $query = "SELECT NumAttempts, CorrectWord FROM Scores WHERE EmailAddress = $1 ORDER BY NumAttempts, CorrectWord ASC LIMIT 10";
    $games = pg_query_params($dbconnection, $query, [$_SESSION["emailAddress"]]);

    while ($game = pg_fetch_assoc($games)) {
        $toReturn[] = [htmlspecialchars($game["numattempts"]), htmlspecialchars($game["correctword"])];
    }

    return $toReturn;
}

function submitScore() {
    global $dbconnection;

    //submit score to database if user is logged in
    if (isset($_SESSION["emailAddress"])) {
        // add a new row to the scores relation
        $query = "INSERT INTO Scores (EmailAddress, CorrectWord, NumAttempts) VALUES ($1, $2, $3)";
        pg_query_params($dbconnection, $query, [$_SESSION["emailAddress"], $_SESSION["game"]->getCorrectWord(), $_SESSION["game"]->getAttempts()]);
    }
    //submit score as a guest if not logged in
    else {
        // add a new row to the scores relation
        $query = "INSERT INTO Scores (EmailAddress, CorrectWord, NumAttempts) VALUES ($1, $2, $3)";
        pg_query_params($dbconnection, $query, ["guest@wordle.com", $_SESSION["game"]->getCorrectWord(), $_SESSION["game"]->getAttempts()]);
    }
}

function resetGame() {
    $_SESSION["game"] = new Game();
    $_SESSION["gameOver"] = false;
    $_SESSION["guess"] = []; //the user's current guess
    $_SESSION["attempts"] = 1; //the row/word that the user is currently on
    $_SESSION["letter"] = 0; //the current letter that the user is entering
    $_SESSION["result"] = null;
    $_SESSION["correctWord"] = "";
    $_SESSION["bufferFull"] = false; //indicates whether the user can still enter keys
    $_SESSION["bufferEmpty"] = true; //indicates whether the user has not entered any keys
}

$response = [];

if (isset($_POST["action"]) && $_POST["action"] == "logout") {
    resetGame(); //reset game before logging out
    $_SESSION["nickname"] = null;
    $_SESSION["emailAddress"] = null; //reset the email address field
    $_SESSION["country"] = null;
}

if (isset($_POST["action"]) && $_POST["action"] == "resetGame") {
    resetGame();
}

if (isset($_POST["action"]) && $_POST["action"] == "getGames") {
    $response["games"] = displayGames();
}

if (isset($_POST["action"]) && isset($_POST["key"]) && $_POST["action"] == "keypress") {
    $guess = $_SESSION["guess"];
    $attempts = $_SESSION["attempts"];
    $gameOver = $_SESSION["gameOver"];
    $key = $_POST["key"];

    if (count($guess) < 5 && !$gameOver) {
        $guess[] = strtoupper($key);
        $_SESSION["guess"] = $guess;
        $_SESSION["bufferEmpty"] = false;
    }

    $_SESSION["letter"]++; //counts the number of keys that were entered

    if ($_SESSION["letter"] > 5) { //if more than 5 keys were pressed, then set the buffer to full and set the count back to 5
        //this prevents users from changing the last letter
        $_SESSION["bufferFull"] = true;
        $_SESSION["letter"] = 5;
    }

    $response["attempts"] = $_SESSION["attempts"];
    $response["letter"] = $_SESSION["letter"];
    $response["bufferFull"] = $_SESSION["bufferFull"];
}

if (isset($_POST["action"]) && $_POST["action"] == "backspace") {
    $guess = $_SESSION["guess"];
    $gameOver = $_SESSION["gameOver"];

    if (count($guess) > 0 && !$gameOver) {
        array_pop($guess);
        $_SESSION["guess"] = $guess;
        $_SESSION["bufferFull"] = false;
    }

    $_SESSION["letter"]--;

    if ($_SESSION["letter"] < 0) { //if backspace is pressed more than 5 times, set the buffer to empty and set the letter back to 0
        $_SESSION["bufferEmpty"] = true;
        $_SESSION["letter"] = 0;
    }

    $response["attempts"] = $_SESSION["attempts"];
    $response["gameOver"] = $_SESSION["gameOver"];
    $response["letter"] = $_SESSION["letter"];
    $response["bufferEmpty"] = $_SESSION["bufferEmpty"];
}

if (isset($_POST["action"]) && $_POST["action"] == "submitGuess") {
    $guess = join("", $_SESSION["guess"]);
    $game = $_SESSION["game"];

    if (strlen($guess) != 5) {
        $_SESSION["result"] = "Guess must be 5 characters.";
    }
    else if (!isWord($guess)) {
        $_SESSION["result"] = "Not a word";
    }
    else {
        $result = $game->checkWord($guess);
        $_SESSION["attempts"]++;
        
        if ($result === true) {
            $_SESSION["gameOver"] = true;
            $_SESSION["game"]->setAttempts($_SESSION["attempts"] - 1); //set the score for this round
            submitScore(); //submit score to database
        }
        else {
            $correctPositions = $result[0];
            $correctLetters = $result[1];
            $incorrectLetters = $result[2];

            if ($_SESSION["attempts"] > 6) {
                $_SESSION["gameOver"] = true;
                $_SESSION["game"]->setAttempts($_SESSION["attempts"]); //set the score for this round
                $_SESSION["correctWord"] = $game->getCorrectWord();
                submitScore(); //submit score to database
            }

            $_SESSION["letter"] = 0; //reset for the next guess
            $_SESSION["guess"] = []; //reset for the next guess
        }

        $_SESSION["result"] = $result;
    }

    $response["games"] = displayGames();
    $response["attempts"] = $_SESSION["attempts"];
    $response["gameOver"] = $_SESSION["gameOver"];
    $response["correctWord"] = $_SESSION["correctWord"];
    $response["result"] = $_SESSION["result"];
}

echo json_encode($response);