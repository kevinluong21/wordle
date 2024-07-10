<?php 
header("Content-Type: application/json");
require "Game.php";

session_start();

//Datamuse API is used to check whether the input is an actual word.
//The API can be found at https://www.datamuse.com/api/
function isWord($guess) {
    $url = "https://api.datamuse.com/words?sp=" . $guess;
    $words = file_get_contents($url);

    if ($words) { 
        $words = json_decode($words);

        if (array_search(strtolower($guess), $words)) { //if guess is found in the list of words, then it is valid
            return true;
        }
        else {
            return false;
        }
    }
    else { //false on failure
        throw new Exception("The Datamuse API ran into an error.");
    }
}

if (!isset($_SESSION["game"])) {
    //make sure to add error message
}

$response = [];

if (isset($_POST["action"]) && isset($_POST["key"]) && $_POST["action"] == "keypress") {
    $guess = $_SESSION["guess"];
    $attempts = $_SESSION["attempts"];
    $key = $_POST["key"];

    if (count($guess) < 5 && $attempts < 6) {
        $guess[] = strtoupper($key);
        $_SESSION["guess"] = $guess;
        $_SESSION["letter"]++;
    }

    $response["guess"] = $_SESSION["guess"];
    $response["attempts"] = $_SESSION["attempts"];
    $response["letter"] = $_SESSION["letter"];
}

if (isset($_POST["action"]) && isset($_POST["key"]) && $_POST["action"] == "backspace") {
    $guess = $_SESSION["guess"];
    $gameOver = $_SESSION["gameOver"];
    $key = $_POST["key"];

    if (count($guess) > 0 && !$gameOver) {
        $_SESSION["letter"]--;
        array_pop($guess);
        $_SESSION["guess"] = $guess;
    }

    $response["guess"] = $_SESSION["guess"];
    $response["attempts"] = $_SESSION["attempts"];
    $response["gameOver"] = $_SESSION["gameOver"];
    $response["letter"] = $_SESSION["letter"];
}

if (isset($_POST["action"]) && isset($_POST["guess"]) && $_SESSION["action"] == "submitGuess") {
    $guess = $_POST["guess"];
    $game = $_SESSION["game"];
    $attempts = $_SESSION["attempts"];

    if (!isWord($guess)) {
        $response["result"] = "Not a word";
    }
    else {
        $result = $game->checkWord($guess);
        
        if ($result === true) {
            $_SESSION["gameOver"] = true;
            $_SESSION["game"]->setAttempts($_SESSION["attempts"] + 1); //set the score for this round
            $_SESSION["games"][] = $_SESSION["game"]; //push current game to the list of games
        }
        else {
            $correctPositions = $result[0];
            $correctLetters = $result[1];
            $incorrectLetters = $result[2];

            if ($attempts < 6) {
                $attempts++;
                $_SESSION["attempts"] = $attempts;
            }
            else {
                $_SESSION["gameOver"] = true;
                $_SESSION["game"]->setAttempts($_SESSION["attempts"] + 1); //set the score for this round
                $_SESSION["games"][] = $_SESSION["game"]; //push current game to the list of games
            }

            $_SESSION["letter"] = 0; //reset for the next guess
            $_SESSION["guess"] = []; //reset for the next guess
        }

        $response["result"] = $result;
    }

    $response["attempts"] = $_SESSION["attempts"];
    $response["gameOver"] = $_SESSION["gameOver"];
    $response["correctWord"] = $_SESSION["correctWord"];
}

echo json_encode($response);
?>