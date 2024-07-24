-- create a database first and run these queries

CREATE TABLE Users (
    EmailAddress VARCHAR, 
    Password VARCHAR NOT NULL, 
    Country VARCHAR NOT NULL,
    Role TEXT DEFAULT 'Player' CHECK (Role IN ('Admin', 'Player')), -- by default, unless specified is Player
    PRIMARY KEY (EmailAddress, Country));

CREATE TABLE Scores (
    ID SERIAL PRIMARY KEY, 
    EmailAddress VARCHAR NOT NULL, 
    Country VARCHAR NOT NULL, 
    CorrectWord VARCHAR, 
    NumAttempts INT, 
    FOREIGN KEY (EmailAddress, Country) REFERENCES Users(EmailAddress, Country));