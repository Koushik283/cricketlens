USE CricketLens_New;

INSERT INTO TEAM (Team_Name, Team_Code, Country)
VALUES
('India', 'IND', 'India'),
('Australia', 'AUS', 'Australia'),
('England', 'ENG', 'England'),
('New Zealand', 'NZ', 'New Zealand'),
('South Africa', 'SA', 'South Africa'),
('Pakistan', 'PAK', 'Pakistan');

SELECT * FROM TEAM;


USE CricketLens_New;

INSERT INTO VENUE (Venue_Name, City, Country)
VALUES
('M. A. Chidambaram Stadium', 'Chennai', 'India'),
('Wankhede Stadium', 'Mumbai', 'India'),
('Narendra Modi Stadium', 'Ahmedabad', 'India'),
('Melbourne Cricket Ground', 'Melbourne', 'Australia'),
('Sydney Cricket Ground', 'Sydney', 'Australia'),
('Lord''s Cricket Ground', 'London', 'England'),
('Eden Park', 'Auckland', 'New Zealand'),
('Newlands Cricket Ground', 'Cape Town', 'South Africa');

SELECT * FROM VENUE;


USE CricketLens_New;

-- INDIA (Team_ID = 1)
INSERT INTO PLAYER
(Player_Name, Role, Batting_Style, Bowling_Style, Team_ID)
VALUES
('Arjun Mehta', 'Batter', 'Right-hand', NULL, 1),
('Rohan Sharma', 'Batter', 'Right-hand', NULL, 1),
('Vikram Patel', 'Batter', 'Left-hand', NULL, 1),
('Aditya Rao', 'All-Rounder', 'Right-hand', 'Right-arm off-break', 1),
('Karan Singh', 'All-Rounder', 'Left-hand', 'Left-arm orthodox', 1),
('Dev Malhotra', 'Wicket-Keeper', 'Right-hand', NULL, 1),
('Nikhil Verma', 'Bowler', 'Right-hand', 'Right-arm fast', 1),
('Samar Khan', 'Bowler', 'Right-hand', 'Right-arm medium', 1),
('Ishaan Das', 'Bowler', 'Left-hand', 'Left-arm fast', 1),
('Manav Joshi', 'Bowler', 'Right-hand', 'Right-arm leg-break', 1);


-- AUSTRALIA (Team_ID = 2)
INSERT INTO PLAYER
(Player_Name, Role, Batting_Style, Bowling_Style, Team_ID)
VALUES
('Liam Carter', 'Batter', 'Right-hand', NULL, 2),
('Noah Wilson', 'Batter', 'Left-hand', NULL, 2),
('Ethan Brooks', 'Batter', 'Right-hand', NULL, 2),
('Oliver Bennett', 'All-Rounder', 'Right-hand', 'Right-arm fast', 2),
('Jack Mitchell', 'All-Rounder', 'Left-hand', 'Left-arm orthodox', 2),
('Lucas Foster', 'Wicket-Keeper', 'Right-hand', NULL, 2),
('Henry Cooper', 'Bowler', 'Right-hand', 'Right-arm fast', 2),
('Mason Clarke', 'Bowler', 'Right-hand', 'Right-arm medium', 2),
('James Walker', 'Bowler', 'Left-hand', 'Left-arm fast', 2),
('Benjamin Scott', 'Bowler', 'Right-hand', 'Right-arm leg-break', 2);


-- ENGLAND (Team_ID = 3)
INSERT INTO PLAYER
(Player_Name, Role, Batting_Style, Bowling_Style, Team_ID)
VALUES
('Harry Morgan', 'Batter', 'Right-hand', NULL, 3),
('Charlie Evans', 'Batter', 'Left-hand', NULL, 3),
('Thomas Reed', 'Batter', 'Right-hand', NULL, 3),
('George Bailey', 'All-Rounder', 'Right-hand', 'Right-arm medium', 3),
('Freddie James', 'All-Rounder', 'Left-hand', 'Left-arm orthodox', 3),
('Oscar Turner', 'Wicket-Keeper', 'Right-hand', NULL, 3),
('Alfie Hughes', 'Bowler', 'Right-hand', 'Right-arm fast', 3),
('Jacob Price', 'Bowler', 'Right-hand', 'Right-arm medium', 3),
('William Cox', 'Bowler', 'Left-hand', 'Left-arm fast', 3),
('Arthur Bell', 'Bowler', 'Right-hand', 'Right-arm leg-break', 3);


-- NEW ZEALAND (Team_ID = 4)
INSERT INTO PLAYER
(Player_Name, Role, Batting_Style, Bowling_Style, Team_ID)
VALUES
('Oliver Taylor', 'Batter', 'Right-hand', NULL, 4),
('Jack Anderson', 'Batter', 'Left-hand', NULL, 4),
('Leo Thompson', 'Batter', 'Right-hand', NULL, 4),
('Finn Harris', 'All-Rounder', 'Right-hand', 'Right-arm medium', 4),
('Max Campbell', 'All-Rounder', 'Left-hand', 'Left-arm orthodox', 4),
('Theo Wright', 'Wicket-Keeper', 'Right-hand', NULL, 4),
('Eli Martin', 'Bowler', 'Right-hand', 'Right-arm fast', 4),
('Hugo Green', 'Bowler', 'Right-hand', 'Right-arm medium', 4),
('Caleb Adams', 'Bowler', 'Left-hand', 'Left-arm fast', 4),
('Oscar King', 'Bowler', 'Right-hand', 'Right-arm leg-break', 4);


-- SOUTH AFRICA (Team_ID = 5)
INSERT INTO PLAYER
(Player_Name, Role, Batting_Style, Bowling_Style, Team_ID)
VALUES
('Daniel Smith', 'Batter', 'Right-hand', NULL, 5),
('Ryan Williams', 'Batter', 'Left-hand', NULL, 5),
('Aaron Brown', 'Batter', 'Right-hand', NULL, 5),
('Nathan Davis', 'All-Rounder', 'Right-hand', 'Right-arm fast', 5),
('David Miller', 'All-Rounder', 'Left-hand', 'Left-arm orthodox', 5),
('Samuel Wilson', 'Wicket-Keeper', 'Right-hand', NULL, 5),
('Michael Taylor', 'Bowler', 'Right-hand', 'Right-arm fast', 5),
('Joseph Thomas', 'Bowler', 'Right-hand', 'Right-arm medium', 5),
('Andrew White', 'Bowler', 'Left-hand', 'Left-arm fast', 5),
('Matthew Lewis', 'Bowler', 'Right-hand', 'Right-arm leg-break', 5);


-- PAKISTAN (Team_ID = 6)
INSERT INTO PLAYER
(Player_Name, Role, Batting_Style, Bowling_Style, Team_ID)
VALUES
('Ahmed Khan', 'Batter', 'Right-hand', NULL, 6),
('Hassan Ali', 'Batter', 'Left-hand', NULL, 6),
('Usman Malik', 'Batter', 'Right-hand', NULL, 6),
('Bilal Ahmed', 'All-Rounder', 'Right-hand', 'Right-arm medium', 6),
('Fahad Hussain', 'All-Rounder', 'Left-hand', 'Left-arm orthodox', 6),
('Saad Raza', 'Wicket-Keeper', 'Right-hand', NULL, 6),
('Imran Shah', 'Bowler', 'Right-hand', 'Right-arm fast', 6),
('Zain Abbas', 'Bowler', 'Right-hand', 'Right-arm medium', 6),
('Danish Iqbal', 'Bowler', 'Left-hand', 'Left-arm fast', 6),
('Yasir Mahmood', 'Bowler', 'Right-hand', 'Right-arm leg-break', 6);


-- VERIFY PLAYER DATA
SELECT COUNT(*) AS Total_Players FROM PLAYER;

SELECT
    T.Team_Name,
    COUNT(P.Player_ID) AS Player_Count
FROM TEAM T
LEFT JOIN PLAYER P ON T.Team_ID = P.Team_ID
GROUP BY T.Team_ID, T.Team_Name
ORDER BY T.Team_ID;


USE CricketLens_New;

INSERT INTO CRICKET_MATCH
(Match_Date, Series_Name, Venue_ID,
 Team1_ID, Team2_ID, Winner_ID, Status)
VALUES

-- India matches
('2026-01-05', 'CricketLens ODI Series', 1, 1, 2, 1, 'Completed'),
('2026-01-10', 'CricketLens ODI Series', 2, 1, 3, 3, 'Completed'),
('2026-01-15', 'CricketLens ODI Series', 3, 1, 4, 1, 'Completed'),
('2026-01-20', 'CricketLens ODI Series', 4, 1, 5, 5, 'Completed'),
('2026-01-25', 'CricketLens ODI Series', 5, 1, 6, 1, 'Completed'),

-- Australia matches
('2026-02-01', 'CricketLens ODI Series', 4, 2, 3, 2, 'Completed'),
('2026-02-06', 'CricketLens ODI Series', 5, 2, 4, 4, 'Completed'),
('2026-02-11', 'CricketLens ODI Series', 6, 2, 5, 2, 'Completed'),
('2026-02-16', 'CricketLens ODI Series', 7, 2, 6, 6, 'Completed'),

-- England matches
('2026-02-21', 'CricketLens ODI Series', 6, 3, 4, 3, 'Completed'),
('2026-02-26', 'CricketLens ODI Series', 7, 3, 5, 5, 'Completed'),
('2026-03-03', 'CricketLens ODI Series', 8, 3, 6, 3, 'Completed'),

-- New Zealand matches
('2026-03-08', 'CricketLens ODI Series', 7, 4, 5, 4, 'Completed'),
('2026-03-13', 'CricketLens ODI Series', 8, 4, 6, 6, 'Completed'),

-- South Africa vs Pakistan
('2026-03-18', 'CricketLens ODI Series', 8, 5, 6, 5, 'Completed');


-- Verify the matches
SELECT
    M.Match_ID,
    M.Match_Date,
    T1.Team_Name AS Team_1,
    T2.Team_Name AS Team_2,
    TW.Team_Name AS Winner,
    V.Venue_Name,
    M.Status
FROM CRICKET_MATCH M
JOIN TEAM T1 ON M.Team1_ID = T1.Team_ID
JOIN TEAM T2 ON M.Team2_ID = T2.Team_ID
LEFT JOIN TEAM TW ON M.Winner_ID = TW.Team_ID
JOIN VENUE V ON M.Venue_ID = V.Venue_ID
ORDER BY M.Match_Date;


USE CricketLens_New;

INSERT INTO INNINGS
(Match_ID, Innings_Number, Batting_Team_ID,
 Bowling_Team_ID, Total_Runs, Wickets_Lost,
 Balls_Bowled, Extras)
VALUES

-- Match 1: India vs Australia
(1, 1, 1, 2, 285, 8, 300, 12),
(1, 2, 2, 1, 260, 10, 286, 15),

-- Match 2: India vs England
(2, 1, 1, 3, 310, 6, 300, 10),
(2, 2, 3, 1, 275, 10, 280, 14),

-- Match 3: India vs New Zealand
(3, 1, 1, 4, 295, 7, 300, 11),
(3, 2, 4, 1, 250, 10, 275, 13),

-- Match 4: India vs South Africa
(4, 1, 1, 5, 265, 10, 295, 9),
(4, 2, 5, 1, 280, 6, 288, 12),

-- Match 5: India vs Pakistan
(5, 1, 1, 6, 320, 5, 300, 14),
(5, 2, 6, 1, 290, 10, 290, 16),

-- Match 6: Australia vs England
(6, 1, 2, 3, 300, 7, 300, 12),
(6, 2, 3, 2, 270, 10, 285, 10),

-- Match 7: Australia vs New Zealand
(7, 1, 2, 4, 275, 8, 300, 11),
(7, 2, 4, 2, 280, 6, 290, 13),

-- Match 8: Australia vs South Africa
(8, 1, 2, 5, 315, 6, 300, 15),
(8, 2, 5, 2, 280, 10, 288, 12),

-- Match 9: Australia vs Pakistan
(9, 1, 2, 6, 260, 10, 290, 10),
(9, 2, 6, 2, 265, 7, 285, 14),

-- Match 10: England vs New Zealand
(10, 1, 3, 4, 290, 8, 300, 12),
(10, 2, 4, 3, 270, 10, 280, 11),

-- Match 11: England vs South Africa
(11, 1, 3, 5, 280, 9, 300, 10),
(11, 2, 5, 3, 285, 6, 290, 13),

-- Match 12: England vs Pakistan
(12, 1, 3, 6, 305, 7, 300, 15),
(12, 2, 6, 3, 275, 10, 280, 12),

-- Match 13: New Zealand vs South Africa
(13, 1, 4, 5, 295, 6, 300, 11),
(13, 2, 5, 4, 270, 10, 285, 14),

-- Match 14: New Zealand vs Pakistan
(14, 1, 4, 6, 265, 10, 295, 10),
(14, 2, 6, 4, 280, 7, 288, 12),

-- Match 15: South Africa vs Pakistan
(15, 1, 5, 6, 310, 5, 300, 13),
(15, 2, 6, 5, 275, 10, 285, 15);


-- Verify innings
SELECT
    I.Innings_ID,
    I.Match_ID,
    I.Innings_Number,
    T.Team_Name AS Batting_Team,
    I.Total_Runs,
    I.Wickets_Lost,
    I.Balls_Bowled
FROM INNINGS I
JOIN TEAM T
    ON I.Batting_Team_ID = T.Team_ID
ORDER BY I.Match_ID, I.Innings_Number;


-- Check total innings
SELECT COUNT(*) AS Total_Innings FROM INNINGS;


USE CricketLens_New;

-- ============================================
-- SCORECARD DATA: BATTING PERFORMANCE
-- ============================================

INSERT INTO SCORECARD
(
    Innings_ID,
    Player_ID,
    Runs_Scored,
    Balls_Faced,
    Fours,
    Sixes,
    Is_Out,
    Dismissal_Type
)
SELECT
    I.Innings_ID,
    P.Player_ID,

    -- Distribute innings runs among 10 batters
    FLOOR((I.Total_Runs - I.Extras) / 10)
    +
    CASE
        WHEN MOD(P.Player_ID - 1, 10)
             < MOD(I.Total_Runs - I.Extras, 10)
        THEN 1
        ELSE 0
    END,

    25 + MOD(P.Player_ID * 7 + I.Innings_ID * 3, 36),

    -- Sample boundary statistics
    FLOOR(
        (
            FLOOR((I.Total_Runs - I.Extras) / 10)
            +
            CASE
                WHEN MOD(P.Player_ID - 1, 10)
                     < MOD(I.Total_Runs - I.Extras, 10)
                THEN 1 ELSE 0
            END
        ) / 12
    ),

    FLOOR(
        (
            FLOOR((I.Total_Runs - I.Extras) / 10)
            +
            CASE
                WHEN MOD(P.Player_ID - 1, 10)
                     < MOD(I.Total_Runs - I.Extras, 10)
                THEN 1 ELSE 0
            END
        ) / 20
    ),

    CASE
        WHEN MOD(P.Player_ID + I.Innings_ID, 4) = 0
        THEN TRUE ELSE FALSE
    END,

    CASE
        WHEN MOD(P.Player_ID + I.Innings_ID, 4) = 0
        THEN 'caught'
        ELSE NULL
    END

FROM INNINGS I
JOIN PLAYER P
    ON P.Team_ID = I.Batting_Team_ID;


-- ============================================
-- SCORECARD DATA: BOWLING PERFORMANCE
-- ============================================

INSERT INTO SCORECARD
(
    Innings_ID,
    Player_ID,
    Balls_Bowled,
    Runs_Conceded,
    Wickets_Taken,
    Maidens
)
SELECT
    I.Innings_ID,
    P.Player_ID,

    18 + MOD(P.Player_ID * 5 + I.Innings_ID * 7, 31),

    20 + MOD(P.Player_ID * 11 + I.Innings_ID * 13, 41),

    MOD(P.Player_ID + I.Innings_ID, 4),

    MOD(P.Player_ID + I.Innings_ID, 3)

FROM INNINGS I
JOIN PLAYER P
    ON P.Team_ID = I.Bowling_Team_ID;


-- ============================================
-- VERIFY SCORECARD DATA
-- ============================================

SELECT COUNT(*) AS Total_Scorecard_Records
FROM SCORECARD;


-- Check player-wise career runs
SELECT
    P.Player_Name,
    T.Team_Name,
    SUM(S.Runs_Scored) AS Career_Runs,
    SUM(S.Wickets_Taken) AS Career_Wickets
FROM PLAYER P
JOIN TEAM T
    ON P.Team_ID = T.Team_ID
JOIN SCORECARD S
    ON P.Player_ID = S.Player_ID
GROUP BY P.Player_ID, P.Player_Name, T.Team_Name
ORDER BY Career_Runs DESC;
