# Design Document

## Front-End Components
### Headers
The header of the game is positioned at the top of the screen and serves as an easily accessible menu for users. The game title is centered within the header, ensuring that it is easily identifiable without overshadowing the gameboard and playing experience. Within the header, users can also find two intuitively recognizable buttons with symbols that represent a button to access the help and instructions, and another to access the scoreboard.

### Gameboard
The gameboard in Wordle is a grid where users can input multiple guesses for a hidden word, each guess leading them closer to the hidden word. The 6x5 grid consists of 30 sleek and minimalist tiles, each allowing a user to type a letter. As hints to help the user guess the hidden word, the tiles change to either yellow, green, or grey based on whether their guessed letter is correct or not. Refer to [README.md](/README.md) for more details. The overall minimalist design of the game allows the user to focus on the guesses of the words themselves. 

### Instructions
The instructions for the Wordle game are designed to be accessible and informative, providing guidance to the user without disrupting the gameplay itself. It is accessible through the button in the headers featuring a question mark, ensuring users can easily find and access the instructions. The instructions themselves are concise and presented to be easily digestible for a new user. It is also easily accessible during any step of the game, which allows players to refer to the instructions as much as they may need. 

### Scoreboard
The button to access the scoreboard in the game is easily identified and located on the right-end of the header, positioned carefully to avoid disrupting a user's gameplay experience. The scoreboard provides players with real-time tracking of their progress, displaying key information such as a short message, their number of wins, and their respective winning word guesses. In addition, the scoreboard includes a button 'Play Again' to allow users to restart the game and play another run. The scoreboard will continue to track the scores of all games while the user is connected to the game. By integrating a scoreboard and an option to replay the game within the game, users can become more invested in the gameplay and their progress. 

### Fonts and Sizes
The primary font for the game is Arial, a timeless sans-serif font designed for readability and accessibility. It is a standard font and widely used amongst websites - modern looking and easy to read under any background. It is also a web-safe font that is typically pre-installed and readily available on the majority of operating systems, eliminating the need for installation and ensuring quick load times.

If Arial is not available, the font switches to the secondary font, Helvetica, which inspired Arial's design. It is just as readable as Arial, with an added touch of elegance and sharper lines. Finally, in the rare instances that both Arial and Helvetica are not available, the website will automatically default to any sans-serif font that the computer has installed, making sure to provide an accessible and readable alternative. 

Font sizes are chosen to ensure clarity and structure. Headers, including the title, use a 16px font to ensure prominence and catch a reader's attention. The letters within the tiles are the same size as the headers, but appear bigger because of the gameboard's design. This assures that the title does not distract the user. This font size ensures overall readability and comfort for the user experience.

### Colours
The colour palette is carefully curated to provide the user with an enhanced user experience, using high-contrasting colours to emphasize readability and accessibility. All the text in the game is black (#000000), and the main game area features a white background (#FFFFFF). Wordle also uses yellow, green, and grey in their respective tiles to indicate the status of each letter in each guess, based on whether or not the letter is a letter in the word and if it's in the correct position or not. These colours provide immediate visual feedback of the guesses, making the game system easy to understand without needing to read instructions. Refer to [README.md](/README.md) for more details on how the colours correlate to the guesses. Overall, these colour aspects provide a modern, sleek, and visually appealing interface that is both user-friendly and eye-catching.