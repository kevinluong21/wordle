var Game = (function() {
    var game = {};
    game.score = 0.0;
    game.highScore = 0.0;
    game.currentWord = "";
    game.wordInventory = ["Happy", "Plain", "Angry"]; //list of possible words to guess

    game.startGame() = function() {
        //if the current score is higher than the high score, set high score to this score
        if (game.score > game.highScore) {
            game.highScore = game.score;
        }
        
        game.score = 0.0; //reset score
        //set a new word to play (keep looping if the current word matches the word that was just played)
        do {
            var currentWord = Math.floor(Math.random() * game.wordInventory.length); //set a new word
        } while (currentWord == game.currentWord);

        game.currentWord = currentWord;
    }

    //check that the length of the input is exactly 5
    function checkLength(input) {
        if (input.length != 5) {
            return false;
        }
        return true;
    }

    //check that all the values in the input are letters (cannot contain special characters, numbers, or spaces)
    function checkCharacters(input) {
        const pattern = /^[a-zA-Z]+$/;
        //pattern.test() will return true if input only contains letters and false otherwise
        return pattern.test();
    }

    game.checkWord(input) = function() {
        //split the input string into letters
        input = input.split("");
    }
});