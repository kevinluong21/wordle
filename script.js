var Game = (function() {
    var game = {};
    game.score = 0.0;
    game.highScore = 0.0;
    game.currentWord = "";
    game.wordInventory = ["Happy", "Plain", "Angry"]; //list of possible words to guess
    game.guesses = []; //list of all user's guesses
    game.wordLength = 5; //set the length of the word to guess

    game.startGame() = function() {
        //if the current score is higher than the high score, set high score to this score
        if (game.score > game.highScore) {
            game.highScore = game.score;
        }
        
        game.score = 0.0; //reset score
        //set a new word to play (keep looping if the current word matches the word that was just played)
        do {
            var currentWord = game.wordInventory[Math.floor(Math.random() * game.wordInventory.length)];
        } while (currentWord == game.currentWord);

        game.currentWord = currentWord;
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

    function checkPositions(inputArray, currentArray, correctPosition) {
        let i = 0
        while (i < game.wordLength) {
            if (inputArray[i] == currentArray[i]) {
                correctPosition.push(i);
            }
            i++;
        }
        return correctPosition;
    }

    function checkLetters() {
        
    }

    game.checkWord(input) = function() {
        //if the input fails any of the checks, then the input is invalid
        if (!checkLength(input)) {
            return "Input is too long";
        }
        else if (!isAlpha(input)) {
            return "Input can only contain letters";
        }
        else if (!isWord(input)) {
            return "Not a word";
        }
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
        let correctPosition = {}; //correct letter and position (marked as green)
        let correctLetter = {}; //letter is in word but wrong position (marked as yellow)


    }
});