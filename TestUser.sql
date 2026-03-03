USE railway;

INSERT INTO Users (Name)
VALUES ('Tad');

INSERT INTO Course (Name, Yardage, Par)
VALUES ('Avon Fields', 6500, 72);

INSERT INTO CourseHole (CourseID, HoleNumber, Par, Yardage)
VALUES (1, 1, 4, 320);

INSERT INTO Round (UserID, CourseID, DatePlayed)
VALUES (1, 1, '2026-02-09');

INSERT INTO RoundHoleStats (RoundID, CourseHoleID, Score, Putts, GIR, FairwayHit)
VALUES (1, 1, 5, 2, FALSE, TRUE);


