var Game = (function() {
    var game = {};
    game.score = 0;
    game.highScore = 0;
    game.currentWord = "";
    game.wordInventory = ["Happy", "Plain", "Angry"]; //list of possible words to guess
    game.guesses = []; //list of all user's guesses
    game.wordLength = 5; //set the length of the word to guess

    game.startGame = function() {
        //if the current score is higher than the high score, set high score to this score
        if (game.score > game.highScore) {
            game.highScore = game.score;
        }
        
        game.score = 0.0; //reset score
        //set a new word to play (keep looping if the current word matches the word that was just played)
        do {
            var currentWord = game.wordInventory[Math.floor(Math.random() * game.wordInventory.length)];
        } while (currentWord == game.currentWord);

        game.currentWord = currentWord.toUpperCase();
    }

    //check that the length of the input is exactly 5
    function checkLength(input) {
        if (input.length != game.wordLength) {
            return false;
        }
        return true;
    }

    //check that all the values in the input are letters (cannot contain special characters, numbers, or spaces)
    function isAlpha(input) {
        const pattern = /^[a-zA-Z]+$/;
        //pattern.test() will return true if input only contains letters and false otherwise
        return pattern.test();
    }

    //check that the input is an actual word
    function isWord(input) {

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
        //set all the letters we know are correct to null
        for (let i = 0; i < correctPositions.length; i++) {
            currentArray[correctPositions[i]] = null;
        }

        //check if the letter is in the list. if it is, set the letter to null in current so that we don't double count.
        for (let i = 0; i < inputArray.length; i++) {
            for (let j = 0; j < currentArray.length; j++) {
                console.log(inputArray[i]);
                if (inputArray[i] == currentArray[j]) {
                    correctLetters.push(i);
                    currentArray[j] = null;
                }
            }
        }

        return correctLetters;
    }

    game.checkWord = function(input) {
        input = input.toUpperCase();
        //if the input fails any of the checks, then the input is invalid
        if (!checkLength(input)) {
            return "Input must be 5 characters";
        }
        else if (!isAlpha(input)) {
            return "Input can only contain letters";
        }
        // else if (!isWord(input)) {
        //     return "Not a word";
        // }
        //add guess to list
        game.guesses.push(input);
        
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

        correctPositions = checkPositions(inputArray, current);
        correctLetters = checkLetters(inputArray, current, correctPositions)

        return [correctPositions, correctLetters];
    }

    return game;
});

var games = []; //stores a list of all games played
var game = Game();
game.startGame();

var guess = [];
var attempts = 0; //the row/word that the user is currently on
var letter = 0; //the letter that the user is entering
var tiles = document.getElementsByClassName("tile");
var inputLetter = document.getElementsByClassName("input-letter");

window.addEventListener("keydown", (event) => {
    //for a single character that is pressed down, check that it is a letter (lowercase or uppercase)
    const pattern = /[a-zA-Z]/;
    if (event.key.length == 1 && pattern.test(event.key)) {
        if (guess.length < 5 && attempts < 6) {
            inputLetter[(attempts * 5) + letter].innerHTML = event.key.toUpperCase();
            guess.push(event.key.toUpperCase());
            letter++;
        }
    }
    //if the key pressed was backspace, erase a letter
    else if (event.key == "Backspace") {
        if (guess.length > 0) {
            letter--;
            inputLetter[(attempts * 5) + letter].innerHTML = "";
            guess.pop();
        }

        console.log(guess);
        console.log("'Backspace' was pressed.");
    }
    //if the key pressed was enter and the user entered 5 letters, submit the guess
    else if (event.key == "Enter" && guess.length == 5) {
        console.log("'Enter' was pressed.");
        let result = game.checkWord(guess.join(""));
        console.log(result);

        //guessed word is correct (game ends)
        if (result == true) {
            for (let i = 0; i < 5; i++) {
                tiles[(attempts * 5) + i].style.backgroundColor = "#40c74b";
            }
        }
        //a list of correct positions and letters was returned
        if (result.length == 2) {
            let correctPositions = result[0];
            let correctLetters = result[1];

            for (let i = 0; i < correctPositions.length; i++) {
                tiles[(attempts * 5) + correctPositions[i]].style.backgroundColor = "#40c74b";
            }

            for (let i = 0; i < correctLetters.length; i++) {
                tiles[(attempts * 5) + correctLetters[i]].style.backgroundColor = "#fff652";
            }
        }

        if (attempts < 6) {
            attempts++;
        }
        letter = 0;
        guess = [];
    }
});