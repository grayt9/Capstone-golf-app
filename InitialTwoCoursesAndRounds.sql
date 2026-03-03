USE Seminar;

INSERT INTO Users (Name)
VALUES 
('Rex'),
('Benjamin');

INSERT INTO Course (Name, Yardage, Par)
VALUES
('Glenview Golf Course', 6823, 72),
('Blue Ash Golf Course', 6336, 72);

INSERT INTO CourseHole(CourseID, HoleNumber, Par, Yardage)
VALUES
(2, 1, 4, 431),
(2, 2, 4, 357),
(2, 3, 3, 220),
(2, 4, 4, 336),
(2, 5, 4, 373),
(2, 6, 4, 426),
(2, 7, 5, 503),
(2, 8, 3, 150),
(2, 9, 5, 563),
(2, 10, 4, 401),
(2, 11, 3, 181),
(2, 12, 5, 547),
(2, 13, 4, 435),
(2, 14, 3, 206),
(2, 15, 4, 385),
(2, 16, 4, 354),
(2, 17, 4, 429),
(2, 18, 5, 526);


INSERT INTO CourseHole (CourseID, HoleNumber, Par, Yardage)
VALUES
(3, 1, 4, 374),
(3, 2, 3, 175),
(3, 3, 4, 378),
(3, 4, 3, 172),
(3, 5, 5, 499),
(3, 6, 4, 407),
(3, 7, 4, 354),
(3, 8, 5, 505),
(3, 9, 4, 349),
(3, 10, 5, 511),
(3, 11, 3, 168),
(3, 12, 4, 376),
(3, 13, 3, 140),
(3, 14, 4, 352),
(3, 15, 4, 380),
(3, 16, 4, 356),
(3, 17, 4, 345),
(3, 18, 5, 495);


INSERT INTO Round (UserID, CourseID, DatePlayed)
VALUES 
(2, 2, '2026-02-08'),
(3, 3, '2026-02-09');

INSERT INTO RoundHoleStats (RoundID, CourseHoleID, Score, Putts, GIR, FairwayHit)
VALUES
(2, 2, 4, 2, 1, 1),
(2, 3, 4, 2, 1, 0),
(2, 4, 2, 1, 1, 1),
(2, 5, 4, 1, 0, 1),
(2, 6, 5, 2, 0, 1),
(2, 7, 4, 2, 1, 1),
(2, 8, 4, 2, 1, 1),
(2, 9, 3, 2, 1, 1),
(2, 10, 5, 2, 1, 0),
(2, 11, 4, 1, 0, 1),
(2, 12, 3, 1, 0, 0),
(2, 13, 5, 3, 1, 1),
(2, 14, 3, 1, 1, 1),
(2, 15, 3, 2, 1, 1),
(2, 16, 4, 2, 1, 0),
(2, 17, 5, 2, 0, 1),
(2, 18, 4, 2, 1, 1),
(2, 19, 5, 2, 1, 1);


INSERT INTO RoundHoleStats (RoundID, CourseHoleID, Score, Putts, GIR, FairwayHit)
VALUES
(3, 20, 6, 3, 0, 0),
(3, 21, 4, 2, 0, 0),
(3, 22, 4, 2, 1, 1),
(3, 23, 4, 2, 0, 0),
(3, 24, 5, 3, 1, 1),
(3, 25, 3, 1, 1, 1),
(3, 26, 4, 2, 1, 1),
(3, 27, 5, 3, 1, 0),
(3, 28, 5, 3, 1, 1),
(3, 29, 5, 2, 1, 0),
(3, 30, 4, 2, 0, 0),
(3, 31, 4, 2, 1, 1),
(3, 32, 3, 1, 0, 0),
(3, 33, 5, 3, 1, 1),
(3, 34, 4, 2, 1, 1),
(3, 35, 4, 2, 1, 0),
(3, 36, 5, 3, 1, 1),
(3, 37, 4, 2, 1, 1);


INSERT INTO Course (Name, Yardage, Par)
VALUES
('Woodland Golf Course', 6422, 72),
('Beckett Ridge Golf Club', 6857, 72);



INSERT INTO CourseHole (CourseID, HoleNumber, Par, Yardage) VALUES
(4,1,4,293),
(4,2,4,379),
(4,3,4,306),
(4,4,3,134),
(4,5,4,344),
(4,6,4,395),
(4,7,4,369),
(4,8,4,393),
(4,9,5,565),
(4,10,4,421),
(4,11,5,499),
(4,12,5,477),
(4,13,3,184),
(4,14,4,383),
(4,15,3,213),
(4,16,4,342),
(4,17,4,368),
(4,18,4,357);

INSERT INTO CourseHole (CourseID, HoleNumber, Par, Yardage) VALUES
(5,1,4,410),
(5,2,4,375),
(5,3,4,420),
(5,4,3,185),
(5,5,5,540),
(5,6,4,405),
(5,7,3,170),
(5,8,4,430),
(5,9,5,560),
(5,10,4,415),
(5,11,4,395),
(5,12,3,190),
(5,13,5,525),
(5,14,4,410),
(5,15,4,400),
(5,16,3,175),
(5,17,4,440),
(5,18,5,565);

INSERT INTO Round (UserID, CourseID, DatePlayed)
VALUES 
(2, 4, '2026-02-15'),
(3, 5, '2026-02-16');



-- Round 4
INSERT INTO RoundHoleStats (RoundID, CourseHoleID, Score, Putts, GIR, FairwayHit) VALUES
(4, 1, 4, 2, TRUE, TRUE),
(4, 2, 5, 2, TRUE, FALSE),
(4, 3, 3, 1, TRUE, TRUE),
(4, 4, 4, 2, TRUE, TRUE),
(4, 5, 6, 3, FALSE, FALSE),
(4, 6, 5, 2, TRUE, TRUE),
(4, 7, 4, 2, TRUE, FALSE),
(4, 8, 3, 1, TRUE, TRUE),
(4, 9, 5, 2, TRUE, TRUE),
(4, 10, 4, 2, TRUE, TRUE),
(4, 11, 5, 2, TRUE, FALSE),
(4, 12, 3, 1, TRUE, TRUE),
(4, 13, 6, 3, FALSE, FALSE),
(4, 14, 4, 2, TRUE, TRUE),
(4, 15, 5, 2, TRUE, FALSE),
(4, 16, 3, 1, TRUE, TRUE),
(4, 17, 4, 2, TRUE, TRUE),
(4, 18, 5, 2, TRUE, TRUE);

-- Round 5
INSERT INTO RoundHoleStats (RoundID, CourseHoleID, Score, Putts, GIR, FairwayHit) VALUES
(5, 1, 5, 2, TRUE, TRUE),
(5, 2, 4, 2, TRUE, FALSE),
(5, 3, 3, 1, TRUE, TRUE),
(5, 4, 6, 3, FALSE, FALSE),
(5, 5, 5, 2, TRUE, TRUE),
(5, 6, 4, 2, TRUE, TRUE),
(5, 7, 5, 2, TRUE, FALSE),
(5, 8, 3, 1, TRUE, TRUE),
(5, 9, 4, 2, TRUE, TRUE),
(5, 10, 5, 2, TRUE, TRUE),
(5, 11, 6, 3, FALSE, FALSE),
(5, 12, 4, 2, TRUE, TRUE),
(5, 13, 5, 2, TRUE, FALSE),
(5, 14, 3, 1, TRUE, TRUE),
(5, 15, 4, 2, TRUE, TRUE),
(5, 16, 5, 2, TRUE, FALSE),
(5, 17, 4, 2, TRUE, TRUE),
(5, 18, 6, 3, FALSE, FALSE);
