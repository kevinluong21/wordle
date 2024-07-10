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
    $attempts = $_SESSION["attempts"];

    if (strlen($guess) != 5) {
        $reponse["result"] = "Guess must be 5 characters.";
    }
    else if (!isWord($guess)) {
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