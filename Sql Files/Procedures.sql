
USE CricketLens_New;

DELIMITER //


-- ============================================
-- PROCEDURE 1: PLAYER CAREER STATISTICS
-- ============================================

CREATE PROCEDURE GetPlayerCareerStats(
    IN p_Player_ID INT
)
BEGIN
    SELECT
        Player_ID,
        Player_Name,
        Team_Name,
        Matches_Played,
        Career_Runs,
        Career_Wickets,
        Total_Fours,
        Total_Sixes
    FROM PLAYER_CAREER_STATS
    WHERE Player_ID = p_Player_ID;
END//


-- ============================================
-- PROCEDURE 2: GET PLAYERS BY TEAM
-- ============================================

CREATE PROCEDURE GetPlayersByTeam(
    IN p_Team_ID INT
)
BEGIN
    SELECT
        P.Player_ID,
        P.Player_Name,
        P.Role,
        P.Batting_Style,
        P.Bowling_Style,
        T.Team_Name
    FROM PLAYER P
    JOIN TEAM T
        ON P.Team_ID = T.Team_ID
    WHERE P.Team_ID = p_Team_ID
    ORDER BY P.Player_Name;
END//


-- ============================================
-- PROCEDURE 3: GET MATCH DETAILS
-- ============================================

CREATE PROCEDURE GetMatchDetails(
    IN p_Match_ID INT
)
BEGIN
    SELECT
        Match_ID,
        Match_Date,
        Series_Name,
        Team_1,
        Team_2,
        Winner,
        Venue_Name,
        Status
    FROM MATCH_RESULTS
    WHERE Match_ID = p_Match_ID;
END//


-- ============================================
-- PROCEDURE 4: TOP RUN SCORERS
-- ============================================

CREATE PROCEDURE GetTopRunScorers(
    IN p_Limit INT
)
BEGIN
    SELECT
        Player_ID,
        Player_Name,
        Team_Name,
        Career_Runs,
        Career_Wickets
    FROM PLAYER_CAREER_STATS
    ORDER BY Career_Runs DESC
    LIMIT p_Limit;
END//


DELIMITER ;


-- ============================================
-- VERIFY PROCEDURES
-- ============================================

SHOW PROCEDURE STATUS
WHERE Db = 'CricketLens_New';
