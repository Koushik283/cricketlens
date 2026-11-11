
USE CricketLens_New;

-- ============================================
-- CRICKETLENS: TRIGGERS
-- ============================================

DELIMITER //


-- TRIGGER 1:
-- Prevent a team from playing against itself
-- and validate the winner.

CREATE TRIGGER trg_validate_match
BEFORE INSERT ON CRICKET_MATCH
FOR EACH ROW
BEGIN
    IF NEW.Team1_ID = NEW.Team2_ID THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'A team cannot play against itself';
    END IF;

    IF NEW.Winner_ID IS NOT NULL
       AND NEW.Winner_ID NOT IN (NEW.Team1_ID, NEW.Team2_ID) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Winner must be one of the participating teams';
    END IF;
END//


-- TRIGGER 2:
-- Ensure batting and bowling teams belong
-- to the selected match.

CREATE TRIGGER trg_validate_innings
BEFORE INSERT ON INNINGS
FOR EACH ROW
BEGIN
    DECLARE v_team1 INT;
    DECLARE v_team2 INT;

    SELECT Team1_ID, Team2_ID
    INTO v_team1, v_team2
    FROM CRICKET_MATCH
    WHERE Match_ID = NEW.Match_ID;

    IF NOT (
        (NEW.Batting_Team_ID = v_team1
         AND NEW.Bowling_Team_ID = v_team2)
        OR
        (NEW.Batting_Team_ID = v_team2
         AND NEW.Bowling_Team_ID = v_team1)
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Innings teams must belong to the selected match';
    END IF;
END//


-- TRIGGER 3:
-- Ensure the scorecard player belongs to
-- one of the teams participating in the innings.

CREATE TRIGGER trg_validate_scorecard
BEFORE INSERT ON SCORECARD
FOR EACH ROW
BEGIN
    DECLARE v_player_team INT;
    DECLARE v_batting_team INT;
    DECLARE v_bowling_team INT;

    SELECT Team_ID
    INTO v_player_team
    FROM PLAYER
    WHERE Player_ID = NEW.Player_ID;

    SELECT Batting_Team_ID, Bowling_Team_ID
    INTO v_batting_team, v_bowling_team
    FROM INNINGS
    WHERE Innings_ID = NEW.Innings_ID;

    IF v_player_team NOT IN (v_batting_team, v_bowling_team) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Player does not belong to either team in this innings';
    END IF;
END//


DELIMITER ;


-- ============================================
-- VERIFY TRIGGERS
-- ============================================

SHOW TRIGGERS;
