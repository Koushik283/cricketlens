USE CricketLens_New;

-- ============================================
-- CRICKETLENS ADVANCED SQL
-- SECTION 1: VIEWS
-- ============================================

USE CricketLens_New;

CREATE VIEW PLAYER_CAREER_STATS AS
SELECT
    P.Player_ID,
    P.Player_Name,
    T.Team_Name,
    COUNT(DISTINCT I.Match_ID) AS Matches_Played,
    SUM(S.Runs_Scored) AS Career_Runs,
    SUM(S.Wickets_Taken) AS Career_Wickets,
    SUM(S.Fours) AS Total_Fours,
    SUM(S.Sixes) AS Total_Sixes
FROM PLAYER P
JOIN TEAM T
    ON P.Team_ID = T.Team_ID
LEFT JOIN SCORECARD S
    ON P.Player_ID = S.Player_ID
LEFT JOIN INNINGS I
    ON S.Innings_ID = I.Innings_ID
GROUP BY
    P.Player_ID,
    P.Player_Name,
    T.Team_Name;

CREATE VIEW MATCH_RESULTS AS
SELECT
    M.Match_ID,
    M.Match_Date,
    M.Series_Name,
    T1.Team_Name AS Team_1,
    T2.Team_Name AS Team_2,
    TW.Team_Name AS Winner,
    V.Venue_Name,
    M.Status
FROM CRICKET_MATCH M
JOIN TEAM T1 ON M.Team1_ID = T1.Team_ID
JOIN TEAM T2 ON M.Team2_ID = T2.Team_ID
LEFT JOIN TEAM TW ON M.Winner_ID = TW.Team_ID
JOIN VENUE V ON M.Venue_ID = V.Venue_ID;

CREATE VIEW INNINGS_SUMMARY AS
SELECT
    I.Innings_ID,
    I.Match_ID,
    I.Innings_Number,
    T1.Team_Name AS Batting_Team,
    T2.Team_Name AS Bowling_Team,
    I.Total_Runs,
    I.Wickets_Lost,
    I.Balls_Bowled,
    I.Extras
FROM INNINGS I
JOIN TEAM T1
    ON I.Batting_Team_ID = T1.Team_ID
JOIN TEAM T2
    ON I.Bowling_Team_ID = T2.Team_ID;


SHOW FULL TABLES
WHERE Table_type = 'VIEW';

SELECT * FROM PLAYER_CAREER_STATS
ORDER BY Career_Runs DESC;

SELECT * FROM MATCH_RESULTS;

SELECT * FROM INNINGS_SUMMARY;