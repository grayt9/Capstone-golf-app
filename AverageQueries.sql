-- Test Queries


USE railway;


--  Get total score 

SELECT RoundID, SUM(Score) AS TotalScore
FROM RoundHoleStats
GROUP BY RoundID;

-- Get Average Score

SELECT AVG(TotalScore)
FROM (
SELECT RoundID, SUM(Score) AS TotalScore
FROM RoundHoleStats
GROUP BY RoundID
) AS RoundTotals;



-- Get total putts
SELECT RoundID, SUM(Putts) AS TotalPutts
FROM RoundHoleStats
GROUP BY RoundID;


-- GIR %
SELECT RoundID, AVG(CASE WHEN GIR = TRUE THEN 1 ELSE 0 END) * 100 AS GIRPercent
FROM RoundHoleStats
GROUP BY RoundID;

-- Fairway %
SELECT RoundID, AVG(CASE WHEN FairwayHit = TRUE THEN 1 ELSE 0 END) * 100 AS FairwayPercent
FROM RoundHoleStats
GROUP BY RoundID;



-- test

SELECT *
FROM RoundHoleStats
JOIN Round 
ON RoundHoleStats.RoundID = Round.RoundID;


-- same query w shortened names

SELECT * 
FROM RoundHoleStats rhs
Join Round r
ON rhs.RoundID = r.RoundID;

-- full average query for putts
SELECT
    r.UserID, AVG(RoundTotals.TotalPutts) AS AvgRoundPutts
FROM (
    SELECT RoundID, SUM(Putts) AS TotalPutts
    FROM RoundHoleStats
    GROUP BY RoundID
) AS RoundTotals
JOIN Round r ON RoundTotals.RoundID = r.RoundID
GROUP BY r.UserID;

-- Full average query for score 

SELECT
    r.UserID, AVG(RoundTotals.TotalScore) AS AvgRoundScore
FROM (
    SELECT RoundID, SUM(Score) AS TotalScore
    FROM RoundHoleStats
    GROUP BY RoundID
) AS RoundTotals
JOIN Round r ON RoundTotals.RoundID = r.RoundID
GROUP BY r.UserID;




INSERT INTO  Users (Name)
VALUES 
('Kara');
