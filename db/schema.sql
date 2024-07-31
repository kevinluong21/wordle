-- create a database first and run these queries

CREATE TABLE Users (
    Nickname VARCHAR(20) NOT NULL, 
    EmailAddress VARCHAR PRIMARY KEY, 
    Password VARCHAR(20) NOT NULL, 
    Country VARCHAR,
    Role TEXT DEFAULT 'Player' CHECK (Role IN ('Admin', 'Player')) -- by default, unless specified is Player
);

CREATE TABLE Scores (
    ScoreID SERIAL PRIMARY KEY, 
    EmailAddress VARCHAR NOT NULL, 
    CorrectWord CHAR(5) NOT NULL, 
    NumAttempts INT NOT NULL, 
    FOREIGN KEY (EmailAddress) REFERENCES Users(EmailAddress)
);

--create admin user
INSERT INTO Users (Nickname, EmailAddress, Password, Country, Role) VALUES ('Admin', 'admin@wordle.com', 'hello123', 'Canada', 'Admin');
--create default guest user (guest@wordle.com is reserved for guests)
INSERT INTO Users (Nickname, EmailAddress, Password, Country) VALUES ('Guest', 'guest@wordle.com', 'N/A', 'N/A');

SELECT * FROM Users;

DROP TABLE Scores;
DROP TABLE Users;