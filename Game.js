//Datamuse API is used to check whether the input is an actual word.
//The API can be found at https://www.datamuse.com/api/

var Game = (function() {
    var game = {};
    game.attempts = 0; //the number of attempts that the user used to guess the word is their "score"
    //if the user exceeds 6 attempts, their score is 7
    game.currentWord = "";
    game.wordInventory = ["Happy", "Plain", "Angry"]; //list of possible words to guess
    game.guesses = []; //list of all user's guesses
    game.wordLength = 5; //set the length of the word to guess
    game.dictionary; //the list of words to check whether the word exists

    game.start = function() {
        //set a new word to play
        var currentWord = game.wordInventory[Math.floor(Math.random() * game.wordInventory.length)];
        game.currentWord = currentWord.toUpperCase();
    }

    game.getCurrentWord = function() {
        return game.currentWord;
    }

    game.setAttempts = function(attempts) {
        game.attempts = attempts;
    }

    //check that the input is an actual word using the Datamuse API
    async function isWord(input) {
        try {
            var data = await fetch("https://api.datamuse.com/words?sp=" + input);
            var words = await data.json();

            if (words.find(item => item.word == input.toLowerCase())) {
                return true;
            }
            return false;
        }
        catch (error) {
            console.log(error);
        }
    }

    function checkPositions(inputArray, currentArray) {
        let i = 0
        let correctPositions = [];
        while (i < game.wordLength) {
            if (inputArray[i] == currentArray[i]) {
                correctPositions.push(i);
            }
            i++;
        }
        return correctPositions;
    }

    function checkLetters(inputArray, currentArray, correctPositions) {
        let correctLetters = [];
        let incorrectLetters = [];
        //set all the letters we know are correct to null
        for (let i = 0; i < correctPositions.length; i++) {
            currentArray[correctPositions[i]] = null;
            inputArray[correctPositions[i]] = null;
        }

        //check if the letter is in the list. if it is, set the letter to null in current so that we don't double count.
        for (let i = 0; i < inputArray.length; i++) {
            let j = 0;
            while (j < currentArray.length) {
                //if no non-null match and about to reach end of array, then this letter from inputArray is nowhere to be found in currentArray
                //therefore, it is incorrect
                if (j == currentArray.length - 1 && inputArray[i] != currentArray[j] && inputArray[i] != null) {
                    incorrectLetters.push(i);
                }
                //if there is a non-null match, then this letter is in the word, but in the wrong position
                else if (inputArray[i] == currentArray[j] && inputArray[i] != null) {
                    correctLetters.push(i);
                    currentArray[j] = null;
                    break;
                }
                j++;
            }
        }

        return [correctLetters, incorrectLetters];
    }

    function addGuess(guess) {
        game.guesses.push(guess);
    }

    game.checkWord = async function(input) {
        input = input.toUpperCase();

        //make sure the input is an actual word
        let validWord = await isWord(input);
        if (!validWord) {
            return "Not a word";
        }

        //add guess to list
        addGuess(input);
        
        //return true if the words are exactly the same
        if (input == game.currentWord) {
            return true;
        }
        
        //if not the same, check which letters are in the correct position and/or in the word
        //split the strings into letters
        let inputArray = input.split("");
        let current = game.currentWord.split("");
        let correctPositions = []; //correct letter and position (marked as green)
        let correctLetters = []; //letter is in word but wrong position (marked as yellow)
        let incorrectLetters = []; //letter is not in word (marked as grey)

        correctPositions = checkPositions(inputArray, current);

        let temp = checkLetters(inputArray, current, correctPositions);
        correctLetters = temp[0];
        incorrectLetters = temp[1];

        return [correctPositions, correctLetters, incorrectLetters];
    }

    return game;
});

export default Game;