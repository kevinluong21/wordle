# Wordle

## Design Document
Refer to [Design Document](/docs/design_system.md) for a detailed design description of the game.

## Disclaimer
This project connects to an API, and if the `php.ini` configurations are not set properly, it may encounter errors. Please ensure that your PHP environment is correctly configured to avoid potential issues.

## Game Components

### How to Setup
To play Wordle, follow these steps:
1. Clone the repository: git clone https://github.com/kevinluong21/wordle.git
2. Using Postgres, start a new server called "wordle" and connect to the database using "localhost" as the host.
3. Open [schema.sql](db/schema.sql) and run all of the queries to set up the database on your local machine.
4. From the project directory, in the terminal, enter the following command: php -S localhost:8000
5. Open [localhost:8000](<http://localhost:8000)>) in your web browser
6. Choose to Play As Guest or Login (Sign Up is only accessible through the Login prompt). 
7. Start guessing words and have fun!

### Use From The Admin's Perspective

Admin Email Address: admin@wordle.com
Admin Password: hello123

As an admin, click on 'Login' and enter the provided email address and password above to access the admin dashboard. After clicking the 'Login' button, you will be redirected to the admin display page. This page allows admins to mannage leaderboard data and user information. This features a section to view the leaderboard of correct words and a section to manage the complete list of the users, including adding new users. 
![Main Page](/docs/assets/design_system/main_page.png)
![Login Screen](/docs/assets/design_system/login_screen.png)
![Login Screen - Email Error](/docs/assets/design_system/login_email_error.png)
![Login Screen - Password Error](/docs/assets/design_system/login_password_error.png)

### Use From The User's Perspective

Guest Email Address: guest@wordle.com (NOTE: This email address is set by default. It is not possible to sign in as a guest. The only way to play as a guest is through pressing 'Play As Guest' on [index.php](index.php).)

As a user, you can either 'Play As Guest' or 'Login'. If you attempt to login under an email that does not exist or if you enter the wrong password, an error message will appear. If you don't have an account, click on 'Sign Up' on the login page and provide your nickname, email address, password and country to create an account. If you sign up under an email that is already in the database, or enter a password that is less than 8 characters or longer than 20 characters, an error message will appear. Once you are logged in, you will be redirected to the Wordle game. Continue reading the documentation to understand the instructions for the game. 
![Main Page](/docs/assets/design_system/main_page.png)
![Login Screen](/docs/assets/design_system/login_screen.png)
![Login Screen - Email Error](/docs/assets/design_system/login_email_error.png)
![Login Screen - Password Error](/docs/assets/design_system/login_password_error.png)
![Sign Up Screen](/docs/assets/design_system/sign_up_screen.png)
![Sign Up Screen - Email Error](/docs/assets/design_system/sign_up_email_error.png)
![Sign Up Screen - Password Error](/docs/assets/design_system/sign_up_password_error.png)

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

### Logout
Click on the Logout icon located on the top right to logout. 