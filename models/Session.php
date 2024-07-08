<?php 
require "Game.php";

session_start();

use Wordle\Game;
use Exception;

if (!isset($_SESSION["game"])) {
    throw new Exception("No active game at the moment. Please try again.");
}

$response = [];

if (isset($_SESSION["action"]) && $_SESSION["action"] == "getStatus") {
    $game = $_SESSION["game"];
    $response["correctPositions"] = $_SESSION["correctPositions"];
    $response["correctLetters"] = $_SESSION["correctLetters"];
    $response["incorrectLetters"] = $_SESSION["incorrectLetters"];
}

?>