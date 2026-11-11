
USE CricketLens_New;

DELIMITER //

-- Function 1: Calculate Batting Average
CREATE FUNCTION GetBattingAverage(p_Player_ID INT)
RETURNS DECIMAL(10,2)
READS SQL DATA
BEGIN
    DECLARE v_runs INT DEFAULT 0;
    DECLARE v_dismissals INT DEFAULT 0;

    SELECT COALESCE(SUM(Runs_Scored), 0),
           COALESCE(SUM(CASE WHEN Is_Out = TRUE THEN 1 ELSE 0 END), 0)
    INTO v_runs, v_dismissals
    FROM SCORECARD
    WHERE Player_ID = p_Player_ID;

    RETURN v_runs / NULLIF(v_dismissals, 0);
END//


-- Function 2: Calculate Batting Strike Rate
CREATE FUNCTION GetStrikeRate(p_Player_ID INT)
RETURNS DECIMAL(10,2)
READS SQL DATA
BEGIN
    DECLARE v_runs INT DEFAULT 0;
    DECLARE v_balls INT DEFAULT 0;

    SELECT COALESCE(SUM(Runs_Scored), 0),
           COALESCE(SUM(Balls_Faced), 0)
    INTO v_runs, v_balls
    FROM SCORECARD
    WHERE Player_ID = p_Player_ID;

    RETURN (v_runs * 100.0) / NULLIF(v_balls, 0);
END//


-- Function 3: Calculate Bowling Economy
CREATE FUNCTION GetBowlingEconomy(p_Player_ID INT)
RETURNS DECIMAL(10,2)
READS SQL DATA
BEGIN
    DECLARE v_runs_conceded INT DEFAULT 0;
    DECLARE v_balls_bowled INT DEFAULT 0;

    SELECT COALESCE(SUM(Runs_Conceded), 0),
           COALESCE(SUM(Balls_Bowled), 0)
    INTO v_runs_conceded, v_balls_bowled
    FROM SCORECARD
    WHERE Player_ID = p_Player_ID;

    RETURN (v_runs_conceded * 6.0) / NULLIF(v_balls_bowled, 0);
END//

DELIMITER ;
