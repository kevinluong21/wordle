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
            console.log(words);
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

var games = []; //stores a list of Game modules that were played

function startGame() {
    // var dictionary = await openFile("dictionary.txt");
    var game = Game();
    // game.start(dictionary);
    game.start();

    var guess = [];
    var gameOver = false;
    var attempts = 1; //the row/word that the user is currently on
    var letter = 0; //the letter that the user is entering
    var dialog = document.getElementsByClassName("dialog")[0];
    var message = document.getElementsByClassName("message")[0];
    var table = document.getElementsByClassName("tiles")[0];
    var tableCells = table.querySelectorAll("td");;
    var tiles = document.getElementsByClassName("tile");
    var tileFronts = document.getElementsByClassName("tile-front");
    var tileBacks = document.getElementsByClassName("tile-back");
    var inputLetters = [];
    var displayLetters = [];

    for (let i = 0; i < tileFronts.length; i++) {
        inputLetters.push(tileFronts[i].children[0]);
    }

    for (let i = 0; i < tileBacks.length; i++) {
        displayLetters.push(tileBacks[i].children[0]);
    }

    //fetching is an async process, so the event listener must call an async function
    window.addEventListener("keydown", async (event) => {
        //for a single character that is pressed down, check that it is a letter (lowercase or uppercase)
        const pattern = /[a-zA-Z]/;
        if (event.key.length == 1 && pattern.test(event.key)) {
            if (guess.length < 5 && attempts <= 6) {
                tiles[((attempts - 1) * 5) + letter].style.border = "2px #a3a3a3 solid";
                tableCells[((attempts - 1) * 5) + letter].classList.add("popout");
                inputLetters[((attempts - 1) * 5) + letter].innerHTML = event.key.toUpperCase();
                displayLetters[((attempts - 1) * 5) + letter].innerHTML = event.key.toUpperCase();
                guess.push(event.key.toUpperCase());
                letter++;
            }
        }
        //if the key pressed was backspace, erase a letter
        else if (event.key == "Backspace") {
            if (guess.length > 0 && !gameOver) {
                letter--;
                tiles[((attempts - 1) * 5) + letter].style.border = "1px #d1d1d1 solid";
                tableCells[((attempts - 1) * 5) + letter].classList.remove("popout");
                inputLetters[((attempts - 1) * 5) + letter].innerHTML = "";
                displayLetters[((attempts - 1) * 5) + letter].innerHTML = "";
                guess.pop();
            }
        }
        //if the key pressed was enter and the user entered 5 letters, submit the guess
        else if (event.key == "Enter" && guess.length == 5) {
            //checkWord is an async function, so we need to wait for it to finish before continuing
            let result = await game.checkWord(guess.join(""));

            //word does not exist (error)
            //if it encounters an error, it will not allow the user to go to the next attempt
            if (result == "Not a word") {
                dialog.classList.add("fade");
                message.innerHTML = "Not a word. Try again.";
                //once the animation ends, remove the class so that the animation can play again on the next iteration
                setTimeout(function() {
                    dialog.classList.remove("fade");
                }, 2500);
            }
            //guessed word is correct (game ends)
            else if (result == true) {
                for (let i = 0; i < 5; i++) {
                    (function(i) {
                        var tileToAnimate = tiles[((attempts - 1) * 5) + i];
                        setTimeout(function() {
                            tileToAnimate.classList.add("reveal-letter");
                        }, i * 500);
                    })(i);
                    
                    tileBacks[((attempts - 1) * 5) + i].style.backgroundColor = "#40c74b";
                    displayLetters[((attempts - 1) * 5) + i].style.color = "white";
                    gameOver = true;
                }
                setTimeout(function() { //wait for the characters to be revealed (wait for animation to complete) and 
                    //then display the message
                    dialog.classList.add("fade");
                    message.innerHTML = "Great job!";
                    //once the animation ends, remove the class so that the animation can play again on the next iteration
                    setTimeout(function() {
                        dialog.classList.remove("fade");
                    }, 2500);
                }, 2500);
                //set the score for this round
                game.setAttempts(attempts);
                //push current game to list of games
                games.push(game);
            }
            //a list of correct positions and letters, and incorrect letters was returned
            else if (result.length == 3) {
                let correctPositions = result[0];
                let correctLetters = result[1];
                let incorrectLetters = result[2];

                var colours = new Array(5);

                for (let i = 0; i < correctLetters.length; i++) {
                    colours[correctLetters[i]] = "#dee607";
                }

                for (let i = 0; i < incorrectLetters.length; i++) {
                    colours[incorrectLetters[i]] = "grey";
                }

                for (let i = 0; i < correctPositions.length; i++) {
                    colours[correctPositions[i]] = "#40c74b";
                }

                for (let i = 0; i < colours.length; i++) {
                    (function(i) {
                        var tileToAnimate = tiles[((attempts - 1) * 5) + i];
                        setTimeout(function() {
                            tileToAnimate.classList.add("reveal-letter");
                        }, i * 500);
                    })(i);

                    tileBacks[((attempts - 1) * 5) + i].style.backgroundColor = colours[i];
                    displayLetters[((attempts - 1) * 5) + i].style.color = "white";
                }

                //only allow the user to go to the next attempt if the user hasn't correctly guessed the word yet
                if (attempts < 6) {
                    attempts++;
                }
                //if the user uses up all 6 attempts, the game ends (the user loses)
                else {
                    setTimeout(function() { //wait for the characters to be revealed (wait for animation to complete) and 
                        //then display the message
                        dialog.classList.add("fade");
                        message.innerHTML = "The correct word is: " + game.getCurrentWord();
                        //once the animation ends, remove the class so that the animation can play again on the next iteration
                        setTimeout(function() {
                            dialog.classList.remove("fade");
                        }, 2500);
                    }, 2500);
                    gameOver = true;
                    //set the score for this round
                    game.setAttempts(attempts + 1);
                    //push current game to list of games
                    games.push(game);
                }
                //only reset the letter count and the current guess if the user can continue playing
                //otherwise, the game prevents the user from making further guesses
                letter = 0;
                guess = [];
            }
        }
    });
}

window.addEventListener("load", startGame);