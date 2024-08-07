<?php 

//This uses the Random Word API to generate random 5-letter words
//https://random-word-api.herokuapp.com/home

namespace Wordle;

use Exception;

class Game {
    private $attempts;
    private $correctWord;
    private $wordInventory;
    private $guesses;
    private const WORD_LENGTH = 5;
    private const NUM_WORDS = 1;

    public function __construct() {
        $this->attempts = 0;
        // $this->wordInventory = $this->generateWords(); //API takes too long to load
        $this->wordInventory = ["hello","bingo","unify","argue","clock","drool","venus","coast","apnea","spicy"];
        $this->guesses = [];

        $this->correctWord = $this->wordInventory[rand(0, count($this->wordInventory) - 1)];
        $this->correctWord =  strtoupper($this->correctWord);
    }

    private function generateWords() {
        $url = "https://random-word-api.herokuapp.com/word?number=" . (string) self::NUM_WORDS . "&&length=" 
        . (string) self::WORD_LENGTH;
        $words = file_get_contents($url);

        if ($words) { 
            $words = json_decode($words);
            return $words;
        }
        else { //false on failure
            throw new Exception("The Random Word Generator API ran into an error.");
        }
    }

    public function getCorrectWord() {
        return $this->correctWord;
    }

    public function setAttempts($numAttempts) {
        $this->attempts = $numAttempts;
    }

    public function getAttempts() {
        return $this->attempts;
    }

    private function checkPositions($inputArray, $correctArray) {
        $correctPositions = [];

        for ($i = 0; $i < self::WORD_LENGTH; $i++) {
            if ($inputArray[$i] == $correctArray[$i]) {
                $correctPositions[] = $i;
            }
        }

        return $correctPositions;
    }

    private function checkLetters($inputArray, $correctArray, $correctPositions) {
        $correctLetters = [];
        $incorrectLetters = [];
        
        //set all the letters we know are correct to null
        for ($i = 0; $i < count($correctPositions); $i++) {
            $correctArray[$correctPositions[$i]] = null;
            $inputArray[$correctPositions[$i]] = null;
        }

        //check if the letter is in the list. if it is, set the letter to null in current so that we don't double count.
        for ($i = 0; $i < count($inputArray); $i++) {
            $j = 0;
            while ($j < count($correctArray)) {
                //if no non-null match and about to reach end of array, then this letter from inputArray is nowhere to be found in currentArray
                //therefore, it is incorrect
                if ($j == count($correctArray) - 1 && $inputArray[$i] != $correctArray[$j] && $inputArray[$i] != null) {
                    $incorrectLetters[] = $i;
                }

                //if there is a non-null match, then this letter is in the word, but in the wrong position
                else if ($inputArray[$i] == $correctArray[$j] && $inputArray[$i] != null) {
                    $correctLetters[] = $i;
                    $correctArray[$j] = null;
                    break;
                }
                $j++;
            }
        }

        return [$correctLetters, $incorrectLetters];
    }

    private function addGuess($guess) {
        $this->guesses[] = $guess;
    }

    public function checkWord($input) {
        $input = strtoupper($input);

        //checking if the word is actually a word is done externally in the session.php file

        //add guess to list
        $this->addGuess($input);

        //return true if the words are exactly the same
        if ($input == $this->correctWord) {
            return true;
        }

        //if not the same, check which letters are in the correct position and/or in the word
        //split the strings into letters
        $inputArray = str_split($input);
        $correctArray = str_split($this->correctWord);
        $correctPositions = [];
        $correctLetters = [];
        $incorrectLetters = [];

        $correctPositions = $this->checkPositions($inputArray, $correctArray);

        $letterStatuses = $this->checkLetters($inputArray, $correctArray, $correctPositions);
        $correctLetters = $letterStatuses[0];
        $incorrectLetters = $letterStatuses[1];

        return [$correctPositions, $correctLetters, $incorrectLetters];
    }
}