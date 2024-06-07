var Game = (function() {
    var game = {};
    game.score = 0;
    game.highScore = 0;
    game.currentWord = "";
    game.wordInventory = ["Happy", "Plain", "Angry"]; //list of possible words to guess
    game.guesses = []; //list of all user's guesses
    game.wordLength = 5; //set the length of the word to guess
    game.dictionary; //the list of words to check whether the word exists

    game.start = function(dictionary) {
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

        game.dictionary = dictionary;
    }

    game.getCurrentWord = function() {
        return game.currentWord;
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
        if (game.dictionary.indexOf(input) == -1) {
            return false;
        }
        return true;
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

    game.checkWord = function(input) {
        input = input.toUpperCase();
        //if the input fails any of the checks, then the input is invalid
        if (!checkLength(input)) {
            return "Input must be 5 characters";
        }
        else if (!isAlpha(input)) {
            return "Input can only contain letters";
        }
        else if (!isWord(input)) {
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

//fetch the list of words from dictionary.txt
async function openFile(path) {
    try {
        var data = await fetch(path);
        var words = await data.text();
        var dictionary = words.split("\n");
        dictionary = dictionary.map(word => word.toUpperCase());
        return dictionary;
    }
    catch (error) {
        console.log(error);
    }
}

var games = []; //stores a list of Game modules that were played

//since the fetching of a file is an async process and it needs to be fully loaded before the game starts,
//wrap the entire game in an async function so that it can wait for the dictionary to be fully loaded before starting
async function startGame() {
    var dictionary = await openFile("dictionary.txt");
    var game = Game();
    game.start(dictionary);

    var guess = [];
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

    window.addEventListener("keydown", (event) => {
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
            if (guess.length > 0) {
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
            let result = game.checkWord(guess.join(""));

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
                console.log(attempts);
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