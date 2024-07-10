<?php 

require "models/Game.php";

session_start();

use Wordle\Game;

$_SESSION["games"] = []; //stores a list of games that have been played
$_SESSION["game"] = new Game();
$_SESSION["gameOver"] = false;
$_SESSION["guess"] = []; //the user's current guess
$_SESSION["attempts"] = 1; //the row/word that the user is currently on
$_SESSION["letter"] = 0; //the current letter that the user is entering
$_SESSION["result"] = null;
$_SESSION["correctWord"] = "";
$_SESSION["bufferFull"] = false; //indicates whether the user can still enter keys
$_SESSION["bufferEmpty"] = true; //indicates whether the user has not entered any keys

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
    <header>
        <div class="menu">
            <h1 class="title">Wordle</h1>

            <div class="buttons">
                <button class="helpButton" id="helpButton" onclick="show('helpPopup')">?</button>
                <button class="helpButton" onclick="show('endingScreen')">&#x1F4CA;</button>
            </div>

            <div class="helpPopup" id="helpPopup">
                <div class="popupHeader">
                    <h3>Instructions for Wordle</h3>
                    <a href="#" onclick="hide('helpPopup')">X</a>
                </div>
                <p>Guess the five-letter word in six tries. After guessing a word, hit enter to submit your guess.</p>
                <p>A green letter means that the letter is correct and in the right spot.</p>
                <p>A yellow letter means that the letter is correct but in the wrong spot.</p>
                <p>A grey letter means that the letter is not in the word at all.</p>
            </div> 
        </div>
    </header>
    <!-- statistics popup -->
    <div class="popup-bg" id="endingScreen">
        <div class="popup">
            <div class="close-btn" onclick='hide("endingScreen")'>&#x2715;</div>
            <h1 class="popup-title">Play a game to see your stats appear here!</h1>
            <table class="games-table"></table>
            <div class="play-again">
                <button class="play-again-btn" onclick="startGame()">
                    Play Again
                </button>
            </div>
        </div>
    </div>

    <div class="dialog">
        <p class="message"></p>
    </div>

    <div class="footer">© 2024 JK (JESSICA + KEVIN).</div>
    <script src="script.js" type="text/javascript"></script>
</body>
</html>