
USE CricketLens_New;

START TRANSACTION;

INSERT INTO CRICKET_MATCH
(Match_Date, Series_Name, Venue_ID, Team1_ID, Team2_ID, Winner_ID, Status)
VALUES
('2026-04-10', 'CricketLens ODI Series',
 1, 1, 2, NULL, 'Scheduled');

-- Check the inserted match
SELECT *
FROM CRICKET_MATCH
WHERE Series_Name = 'CricketLens ODI Series';

-- Permanently save the transaction
COMMIT;


-- ROLLBACK demonstration

START TRANSACTION;

INSERT INTO CRICKET_MATCH
(Match_Date, Series_Name, Venue_ID, Team1_ID, Team2_ID, Winner_ID, Status)
VALUES
('2026-04-15', 'Rollback Test Series',
 2, 1, 3, NULL, 'Scheduled');

-- Check the temporary record
SELECT *
FROM CRICKET_MATCH
WHERE Series_Name = 'Rollback Test Series';

-- Undo the insertion
ROLLBACK;

-- Check whether the record still exists
SELECT *
FROM CRICKET_MATCH
WHERE Series_Name = 'Rollback Test Series';
