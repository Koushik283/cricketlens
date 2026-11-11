
-- ============================================
-- CRICKETLENS DATABASE - TABLE CREATION
-- ============================================

CREATE DATABASE IF NOT EXISTS CricketLens_New;
USE CricketLens_New;

-- ============================================
-- STEP 1: DROP EXISTING TABLES
-- ============================================

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS SCORECARD;
DROP TABLE IF EXISTS INNINGS;
DROP TABLE IF EXISTS CRICKET_MATCH;
DROP TABLE IF EXISTS PLAYER;
DROP TABLE IF EXISTS VENUE;
DROP TABLE IF EXISTS TEAM;
DROP TABLE IF EXISTS APP_USER;

SET FOREIGN_KEY_CHECKS = 1;


-- ============================================
-- STEP 2: APP_USER TABLE
-- Stores Admin and Viewer accounts
-- ============================================

CREATE TABLE APP_USER (
    User_ID INT AUTO_INCREMENT,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Password_Hash VARCHAR(255) NOT NULL,
    Role ENUM('Admin', 'Viewer') NOT NULL DEFAULT 'Viewer',
    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_app_user PRIMARY KEY (User_ID),
    CONSTRAINT uq_user_email UNIQUE (Email)
) ENGINE=InnoDB;


-- ============================================
-- STEP 3: TEAM TABLE
-- Stores international cricket teams
-- ============================================

CREATE TABLE TEAM (
    Team_ID INT AUTO_INCREMENT,
    Team_Name VARCHAR(100) NOT NULL,
    Team_Code VARCHAR(5) NOT NULL,
    Country VARCHAR(100) NOT NULL,

    CONSTRAINT pk_team PRIMARY KEY (Team_ID),
    CONSTRAINT uq_team_name UNIQUE (Team_Name),
    CONSTRAINT uq_team_code UNIQUE (Team_Code)
) ENGINE=InnoDB;


-- ============================================
-- STEP 4: PLAYER TABLE
-- Stores player information
-- ============================================

CREATE TABLE PLAYER (
    Player_ID INT AUTO_INCREMENT,
    Player_Name VARCHAR(100) NOT NULL,
    Role ENUM('Batter', 'Bowler', 'All-Rounder', 'Wicket-Keeper') NOT NULL,
    Batting_Style VARCHAR(30),
    Bowling_Style VARCHAR(50),
    Team_ID INT NOT NULL,

    CONSTRAINT pk_player PRIMARY KEY (Player_ID),

    CONSTRAINT fk_player_team
        FOREIGN KEY (Team_ID)
        REFERENCES TEAM(Team_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    INDEX idx_player_team (Team_ID)
) ENGINE=InnoDB;


-- ============================================
-- STEP 5: VENUE TABLE
-- Stores stadium information
-- ============================================

CREATE TABLE VENUE (
    Venue_ID INT AUTO_INCREMENT,
    Venue_Name VARCHAR(150) NOT NULL,
    City VARCHAR(100) NOT NULL,
    Country VARCHAR(100) NOT NULL,

    CONSTRAINT pk_venue PRIMARY KEY (Venue_ID),

    CONSTRAINT uq_venue
        UNIQUE (Venue_Name, City, Country)
) ENGINE=InnoDB;


-- ============================================
-- STEP 6: CRICKET_MATCH TABLE
-- Stores match details
-- ============================================

CREATE TABLE CRICKET_MATCH (
    Match_ID INT AUTO_INCREMENT,
    Match_Date DATE NOT NULL,
    Series_Name VARCHAR(150) NOT NULL,
    Venue_ID INT NOT NULL,
    Team1_ID INT NOT NULL,
    Team2_ID INT NOT NULL,
    Winner_ID INT,
    Status ENUM('Scheduled', 'Completed', 'Abandoned')
        NOT NULL DEFAULT 'Scheduled',

    CONSTRAINT pk_cricket_match PRIMARY KEY (Match_ID),

    CONSTRAINT fk_match_venue
        FOREIGN KEY (Venue_ID)
        REFERENCES VENUE(Venue_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_match_team1
        FOREIGN KEY (Team1_ID)
        REFERENCES TEAM(Team_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_match_team2
        FOREIGN KEY (Team2_ID)
        REFERENCES TEAM(Team_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_match_winner
        FOREIGN KEY (Winner_ID)
        REFERENCES TEAM(Team_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    INDEX idx_match_date (Match_Date)
) ENGINE=InnoDB;


-- ============================================
-- STEP 7: INNINGS TABLE
-- Stores innings-level scores
-- ============================================

CREATE TABLE INNINGS (
    Innings_ID INT AUTO_INCREMENT,
    Match_ID INT NOT NULL,
    Innings_Number TINYINT NOT NULL,
    Batting_Team_ID INT NOT NULL,
    Bowling_Team_ID INT NOT NULL,
    Total_Runs INT NOT NULL DEFAULT 0,
    Wickets_Lost TINYINT NOT NULL DEFAULT 0,
    Balls_Bowled INT NOT NULL DEFAULT 0,
    Extras INT NOT NULL DEFAULT 0,

    CONSTRAINT pk_innings PRIMARY KEY (Innings_ID),

    CONSTRAINT fk_innings_match
        FOREIGN KEY (Match_ID)
        REFERENCES CRICKET_MATCH(Match_ID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_innings_batting_team
        FOREIGN KEY (Batting_Team_ID)
        REFERENCES TEAM(Team_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_innings_bowling_team
        FOREIGN KEY (Bowling_Team_ID)
        REFERENCES TEAM(Team_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_match_innings
        UNIQUE (Match_ID, Innings_Number),

    CONSTRAINT chk_innings_number
        CHECK (Innings_Number BETWEEN 1 AND 2),

    CONSTRAINT chk_innings_scores
        CHECK (
            Total_Runs >= 0
            AND Wickets_Lost BETWEEN 0 AND 10
            AND Balls_Bowled >= 0
            AND Extras >= 0
        ),

    INDEX idx_innings_match (Match_ID)
) ENGINE=InnoDB;


-- ============================================
-- STEP 8: SCORECARD TABLE
-- Stores individual player batting and bowling
-- performance in each innings
-- ============================================

CREATE TABLE SCORECARD (
    Scorecard_ID INT AUTO_INCREMENT,
    Innings_ID INT NOT NULL,
    Player_ID INT NOT NULL,

    Runs_Scored INT NOT NULL DEFAULT 0,
    Balls_Faced INT NOT NULL DEFAULT 0,
    Fours INT NOT NULL DEFAULT 0,
    Sixes INT NOT NULL DEFAULT 0,
    Is_Out BOOLEAN NOT NULL DEFAULT FALSE,
    Dismissal_Type VARCHAR(50),

    Balls_Bowled INT NOT NULL DEFAULT 0,
    Runs_Conceded INT NOT NULL DEFAULT 0,
    Wickets_Taken TINYINT NOT NULL DEFAULT 0,
    Maidens INT NOT NULL DEFAULT 0,

    CONSTRAINT pk_scorecard PRIMARY KEY (Scorecard_ID),

    CONSTRAINT fk_scorecard_innings
        FOREIGN KEY (Innings_ID)
        REFERENCES INNINGS(Innings_ID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_scorecard_player
        FOREIGN KEY (Player_ID)
        REFERENCES PLAYER(Player_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_player_innings
        UNIQUE (Innings_ID, Player_ID),

    CONSTRAINT chk_batting_stats
        CHECK (
            Runs_Scored >= 0
            AND Balls_Faced >= 0
            AND Fours >= 0
            AND Sixes >= 0
        ),

    CONSTRAINT chk_bowling_stats
        CHECK (
            Balls_Bowled >= 0
            AND Runs_Conceded >= 0
            AND Wickets_Taken BETWEEN 0 AND 10
            AND Maidens >= 0
        ),

    INDEX idx_scorecard_player (Player_ID),
    INDEX idx_scorecard_innings (Innings_ID)
) ENGINE=InnoDB;


-- ============================================
-- STEP 9: VERIFY TABLE CREATION
-- ============================================

SHOW TABLES;
