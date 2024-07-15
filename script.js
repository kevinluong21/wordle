//Datamuse API is used to check whether the input is an actual word.
//The API can be found at https://www.datamuse.com/api/

var dialog = document.getElementsByClassName("dialog")[0];
var message = document.getElementsByClassName("message")[0];
var table;
var tableCells;
var tiles;
var tileFronts;
var tileBacks;
var endingScreen = document.getElementsByClassName("popup-bg")[0];
var inputLetters;
var displayLetters;

//build the game board before the start of each game
//this way, the board can be quickly cleared when a new game is started
function buildGame() {
    var oldTiles = document.getElementsByClassName("tiles")[0];
    var tiles = document.createElement("table");
    tiles.classList.add("tiles");

    for (let i = 0; i < 6; i++) {
        var row = document.createElement("tr");

        for (let j = 0; j < 5; j++) {
            var cell = document.createElement("td");
            var tile = document.createElement("div");
            var tileFront = document.createElement("div");
            var tileBack = document.createElement("div");
            var inputLetter = document.createElement("h1");
            var displayLetter = document.createElement("h1");
    
            tile.classList.add("tile");
            tileFront.classList.add("tile-front");
            tileBack.classList.add("tile-back");
            inputLetter.classList.add("input-letter");
            displayLetter.classList.add("input-letter");
    
            tileFront.appendChild(inputLetter);
            tileBack.appendChild(displayLetter);
            tile.appendChild(tileFront);
            tile.appendChild(tileBack);
    
            cell.appendChild(tile);
            row.appendChild(cell);
        }
        tiles.appendChild(row);
    }
    if (oldTiles) {
        document.body.replaceChild(tiles, oldTiles);
    }
    else {
        document.body.insertBefore(tiles, document.getElementsByClassName("footer")[0]);
    }
}

function keypress(key) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                console.log(this.responseText);
                var response = JSON.parse(this.responseText);
                var attempts = response["attempts"];
                var letter = response["letter"] - 1;
                var bufferFull = response["bufferFull"];

                if (!bufferFull && attempts <= 6) {
                    tiles[((attempts - 1) * 5) + letter].style.border = "2px #a3a3a3 solid";
                    tableCells[((attempts - 1) * 5) + letter].classList.add("popout");
                    inputLetters[((attempts - 1) * 5) + letter].innerHTML = key.toUpperCase();
                    displayLetters[((attempts - 1) * 5) + letter].innerHTML = key.toUpperCase();
                }
            }
            catch (error) {
                console.log("Error during keypress:", error);
            }
        }
    }
    xhttp.open("POST", "models/Session.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=keypress&key=" + String(key));
}

function backspace() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var response = JSON.parse(this.responseText);
                var attempts = response["attempts"];
                var gameOver = response["gameOver"];
                var letter = response["letter"];
                var bufferEmpty = response["bufferEmpty"];

                if (!bufferEmpty && !gameOver) {
                    tiles[((attempts - 1) * 5) + letter].style.border = "1px #d1d1d1 solid";
                    tableCells[((attempts - 1) * 5) + letter].classList.remove("popout");
                    inputLetters[((attempts - 1) * 5) + letter].innerHTML = "";
                    displayLetters[((attempts - 1) * 5) + letter].innerHTML = "";
                }
            }
            catch (error) {
                console.log("Error during backspace:", error);
            }
        }
    }
    xhttp.open("POST", "models/Session.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=backspace");
}

function submitGuess() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            try {
                var response = JSON.parse(this.responseText);
                var games = response["games"];
                var guess = response["guess"];
                var result = response["result"];
                var attempts = response["attempts"] - 1;
                var gameOver = response["gameOver"];
                var correctWord = response["correctWord"];

                console.log(response);
    
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
                        //and display the ending screen
                        setTimeout(function() {
                            dialog.classList.remove("fade");
                            endingPopup("win", games);
                        }, 2500);
                    }, 2500);
    
                    window.removeEventListener("keydown", keydownHandler); //remove keydown event so that when startGame is called
                    //again, a new event listener is added
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
    
                    //if the user uses up all 6 attempts, the game ends (the user loses)
                    if (gameOver) {
                        setTimeout(function() { //wait for the characters to be revealed (wait for animation to complete) and 
                            //then display the message
                            dialog.classList.add("fade");
                            message.innerHTML = "The correct word is: " + correctWord;
                            //once the animation ends, remove the class so that the animation can play again on the next iteration
                            //and display the ending screen
                            setTimeout(function() {
                                dialog.classList.remove("fade");
                                endingPopup("loss", games);
                            }, 2500);
                        }, 2500);
    
                        window.removeEventListener("keydown", keydownHandler); //remove keydown event so that when startGame is called
                        //again, a new event listener is added
                    }
                }
            }
            catch (error) {
                console.log("Ran into an error while updating:", error);
            }
        }
    }
    xhttp.open("POST", "models/Session.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=submitGuess");
}

function keydownHandler(event) {
    //for a single character that is pressed down, check that it is a letter (lowercase or uppercase)
    const pattern = /[a-zA-Z]/;
    if (event.key.length == 1 && pattern.test(event.key)) {
        keypress(event.key);
    }
    //if the key pressed was backspace, erase a letter
    else if (event.key == "Backspace") {
        backspace();
    }
    else if (event.key == "Enter") {
        submitGuess();
    }
}

//build a table of all the rounds that the user has played
function displayAllGames(games) {
    var popup = document.getElementsByClassName("popup")[0];
    var gamesTable = document.createElement("table");
    gamesTable.classList.add("games-table");
    var gamesLen = 10;

    games.sort(function(a, b){return a[0] - b[0]}); //sort by score (lowest score is first)

    if (games.length < 10) { //only display the top 10 scores
        gamesLen = games.length;
    }

    games = games.slice(0, gamesLen); //take the top 10 scores (if less than 10, take all of them)

    for (let i = 0; i < gamesLen; i++) {
        var row = document.createElement("tr");

        var rowNum = document.createElement("td");
        rowNum.innerHTML = i + 1;

        var correctWord = document.createElement("td");
        correctWord.innerHTML = games[i][1];

        var result = document.createElement("td");
        if (games[i][0] == 7) {
            result.innerHTML = "Loss";
        }
        else {
            result.innerHTML = "Won in " + games[i][0] + " guesses";
        }

        row.appendChild(rowNum);
        row.appendChild(correctWord);
        row.appendChild(result);
        gamesTable.appendChild(row);
        
        popup.replaceChild(gamesTable, popup.children[2]); //replace the original table with the new table
    }
}

function endingPopup(result, games) {
    var popupTitle = document.getElementsByClassName("popup-title")[0];

    show("endingScreen");
    
    if (result == "win") {
        popupTitle.innerHTML = "Congratulations!";
    }
    else if (result == "loss") {
        popupTitle.innerHTML = "Better luck next time!";
    }
    
    displayAllGames(games);
}

// When user clicks on button, show message
function show(message) {
    document.getElementById(message).style.display = 'block'
}

// When user clicks on button, hide mssage
function hide(message) {
    document.getElementById(message).style.display = 'none'
}

function startGame() {
    //request to reset the game
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "models/Session.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("action=resetGame");

    buildGame(); //build the game board at the start of each game

    table = document.getElementsByClassName("tiles")[0];
    tableCells = table.querySelectorAll("td");
    tiles = document.getElementsByClassName("tile");
    tileFronts = document.getElementsByClassName("tile-front");
    tileBacks = document.getElementsByClassName("tile-back");
    inputLetters = [];
    displayLetters = [];

    //disable the ending screen once starting a new game
    hide("endingScreen");

    for (let i = 0; i < tileFronts.length; i++) {
        inputLetters.push(tileFronts[i].children[0]);
    }

    for (let i = 0; i < tileBacks.length; i++) {
        displayLetters.push(tileBacks[i].children[0]);
    }

    window.addEventListener("keydown", keydownHandler);
}

//on load, execute the startGame() function
window.addEventListener("load", startGame);