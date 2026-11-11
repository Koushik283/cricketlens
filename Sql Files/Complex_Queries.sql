
USE CricketLens_New;

-- JOIN Query 1: Display complete match details

SELECT
    M.Match_ID,
    M.Match_Date,
    T1.Team_Name AS Team1,
    T2.Team_Name AS Team2,
    TW.Team_Name AS Winner,
    V.Venue_Name,
    M.Status

FROM CRICKET_MATCH M

INNER JOIN TEAM T1
    ON M.Team1_ID = T1.Team_ID

INNER JOIN TEAM T2
    ON M.Team2_ID = T2.Team_ID

LEFT JOIN TEAM TW
    ON M.Winner_ID = TW.Team_ID

INNER JOIN VENUE V
    ON M.Venue_ID = V.Venue_ID

ORDER BY M.Match_Date;


-- JOIN Query 2: Display players with their team details

SELECT
    P.Player_ID,
    P.Player_Name,
    P.Role,
    P.Batting_Style,
    P.Bowling_Style,
    T.Team_Name,
    T.Team_Code

FROM PLAYER P

INNER JOIN TEAM T
    ON P.Team_ID = T.Team_ID

ORDER BY T.Team_Name, P.Player_Name;


-- JOIN Query 3: Display innings details

SELECT
    I.Innings_ID,
    I.Match_ID,
    I.Innings_Number,
    T1.Team_Name AS Batting_Team,
    T2.Team_Name AS Bowling_Team,
    I.Total_Runs,
    I.Wickets_Lost

FROM INNINGS I

INNER JOIN TEAM T1
    ON I.Batting_Team_ID = T1.Team_ID

INNER JOIN TEAM T2
    ON I.Bowling_Team_ID = T2.Team_ID

ORDER BY I.Match_ID, I.Innings_Number;



-- ==========================================
-- NESTED SUBQUERY 1:
-- Players scoring above average career runs
-- ==========================================

SELECT
    Player_ID,
    Player_Name,
    Team_Name,
    Career_Runs
FROM PLAYER_CAREER_STATS
WHERE Career_Runs > (
    SELECT AVG(Career_Runs)
    FROM PLAYER_CAREER_STATS
)
ORDER BY Career_Runs DESC;


-- ==========================================
-- NESTED SUBQUERY 2:
-- Players belonging to winning teams
-- ==========================================

SELECT
    Player_ID,
    Player_Name,
    Team_ID
FROM PLAYER
WHERE Team_ID IN (
    SELECT DISTINCT Winner_ID
    FROM CRICKET_MATCH
    WHERE Winner_ID IS NOT NULL
)
ORDER BY Team_ID, Player_Name;


USE CricketLens_New;

-- ==========================================
-- CORRELATED SUBQUERY 1:
-- Find players scoring above their team average
-- ==========================================

SELECT
    P.Player_ID,
    P.Player_Name,
    T.Team_Name,
    PCS.Career_Runs
FROM PLAYER P
INNER JOIN TEAM T
    ON P.Team_ID = T.Team_ID
INNER JOIN PLAYER_CAREER_STATS PCS
    ON P.Player_ID = PCS.Player_ID
WHERE PCS.Career_Runs > (
    SELECT AVG(PCS2.Career_Runs)
    FROM PLAYER P2
    INNER JOIN PLAYER_CAREER_STATS PCS2
        ON P2.Player_ID = PCS2.Player_ID
    WHERE P2.Team_ID = P.Team_ID
)
ORDER BY T.Team_Name, PCS.Career_Runs DESC;


-- ==========================================
-- CORRELATED SUBQUERY 2:
-- Find players who have scored the maximum
-- runs in their respective teams
-- ==========================================

SELECT
    P.Player_ID,
    P.Player_Name,
    T.Team_Name,
    PCS.Career_Runs
FROM PLAYER P
INNER JOIN TEAM T
    ON P.Team_ID = T.Team_ID
INNER JOIN PLAYER_CAREER_STATS PCS
    ON P.Player_ID = PCS.Player_ID
WHERE PCS.Career_Runs = (
    SELECT MAX(PCS2.Career_Runs)
    FROM PLAYER P2
    INNER JOIN PLAYER_CAREER_STATS PCS2
        ON P2.Player_ID = PCS2.Player_ID
    WHERE P2.Team_ID = P.Team_ID
)
ORDER BY T.Team_Name;


-- ==========================================
-- CORRELATED SUBQUERY 3:
-- Find teams that have won at least one match
-- ==========================================

SELECT
    T.Team_ID,
    T.Team_Name
FROM TEAM T
WHERE EXISTS (
    SELECT 1
    FROM CRICKET_MATCH M
    WHERE M.Winner_ID = T.Team_ID
)
ORDER BY T.Team_Name;


-- ==========================================
-- RECURSIVE QUERY 1:
-- Generate a sequence of match numbers
-- ==========================================

WITH RECURSIVE MatchSequence AS
(
    -- Anchor member: starting value
    SELECT 1 AS Match_Number

    UNION ALL

    -- Recursive member: generate next number
    SELECT Match_Number + 1
    FROM MatchSequence
    WHERE Match_Number < (
        SELECT COUNT(*) FROM CRICKET_MATCH
    )
)

SELECT Match_Number
FROM MatchSequence;


-- ==========================================
-- CTE QUERY 1: Players with above-average runs
-- ==========================================

WITH AverageRuns AS
(
    SELECT AVG(Career_Runs) AS Avg_Runs
    FROM PLAYER_CAREER_STATS
)
SELECT
    Player_ID,
    Player_Name,
    Team_Name,
    Career_Runs
FROM PLAYER_CAREER_STATS
WHERE Career_Runs > (
    SELECT Avg_Runs FROM AverageRuns
)
ORDER BY Career_Runs DESC;


-- ==========================================
-- CTE QUERY 2: Team-wise player statistics
-- ==========================================

WITH TeamStats AS
(
    SELECT
        T.Team_ID,
        T.Team_Name,
        COUNT(P.Player_ID) AS Total_Players
    FROM TEAM T
    LEFT JOIN PLAYER P
        ON T.Team_ID = P.Team_ID
    GROUP BY T.Team_ID, T.Team_Name
)
SELECT *
FROM TeamStats
ORDER BY Total_Players DESC, Team_Name;
