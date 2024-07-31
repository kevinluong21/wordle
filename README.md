# Wordle

## Design Document
Refer to [Design Document](/docs/design_system.md) for a detailed design description of the game.

## Disclaimer
This project connects to an API, and if the `php.ini` configurations are not set properly, it may encounter errors. Please ensure that your PHP environment is correctly configured to avoid potential issues.

## Game Components

### How to Setup
To play Wordle, follow these steps:
1. Clone the repository: git clone https://github.com/kevinluong21/wordle.git
2. In the Wordle directory in your terminal
3. In the terminal, enter the following command: php -S localhost:8000
2. Open [localhost:8000](<http://localhost:8000)>) in your web browser
3. Start guessing words and have fun!

### Use from an Admin's Perspective

Admin Username: admin@wordle.com
Admin Password: hello123

As an admin, click on 'Login' and enter the provided username and password above to access the admin dashboard. Then, click the 'Login' button to login. 

### Use from an User's Perspective

As a user, you can either 'Play as Guest' or 'Login'. If you don't have an account, click on 'Sign up' on the login page and provide your email address, password and country to create an account. 

### Gameplay
The goal of the game is to guess the correct five-letter word within six tries. After typing in a guess of the word, press enter to submit your guess. Ensure that your guess is a valid word in order to proceed. To make corrections, use the backspace key to edit your entry. 
After each guess, each tile/letter is marked with a colour that indicates further information about the guess:
- A green letter means that the letter is correct and in the right spot. 
- A yellow letter means that the letter is correct but in the wrong spot. 
- A grey letter means that the letter is not in the word at all.

### Get Instructions
For detailed instructions to refer to while in-game, click on the question mark icon located on the top right to access the instructions for the game. This will not restart or affect your progress in the game. 

### Get Scores
For information relating to your scores and progress, click on the Scoreboard icon located on the top right to access the scoreboard. The scoreboard tracks information such as your number of games played, and game history such as the hidden word for each game, and whether you won or lost the game.

### Play Again
You win when you guess the correct hidden word. Whether you guess the correct word or not, click on the Scoreboard icon located on the top right and click on the green 'Play Again' button to restart the game and replay it. 