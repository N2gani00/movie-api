/* 2024-11-13 12:39:50 [167 ms] */ 
CREATE TABLE Genre(  
    GenreID SERIAL PRIMARY KEY,
    GenreName VARCHAR(50) UNIQUE NOT NULL
);
/* 2024-11-13 12:39:55 [31 ms] */ 
CREATE TABLE "User" (
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    BirthYear INT CHECK (BirthYear BETWEEN 1900 AND EXTRACT (YEAR FROM CURRENT_DATE))
);
/* 2024-11-13 12:45:50 [13 ms] */ 
CREATE TABLE Movie (
    MovieID SERIAL PRIMARY KEY,
    GenreID INT,
    MovieName VARCHAR(100) NOT NULL,
    Year INT CHECK (Year >= 1888), -- The first film was created in 1888
    FOREIGN KEY (GenreID) REFERENCES Genre(GenreID)
);
/* 2024-11-13 12:48:47 [25 ms] */ 
CREATE TABLE Review (
    ReviewID SERIAL PRIMARY KEY,
    Username VARCHAR(50),
    Stars INT CHECK (Stars BETWEEN 1 AND 5),
    ReviewText TEXT,
    MovieID INT,
    FOREIGN KEY (Username) REFERENCES "User"(Username),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID)
);
/* 2024-11-13 12:48:48 [36 ms] */ 
CREATE TABLE Favorite (
    FavoriteID SERIAL PRIMARY KEY,
    Username VARCHAR(50),
    MovieID INT,
    FOREIGN KEY (Username) REFERENCES "User"(Username),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
    UNIQUE (Username, MovieID)
);
/* 2024-11-13 12:58:55 [16 ms] */ 
INSERT INTO "User" (Name, Username, Password, BirthYear)
VALUES
('John Doe', 'john_doe', 'password123', 1990),
('Jane Doe', 'jane_doe', 'securepass456', 1992),
('Alice Smith', 'alice_smith', 'alicePass789', 1985),
('Bob Jones', 'bob_jones', 'bobSecure2024', 1988);
/* 2024-11-13 13:02:43 [29 ms] */ 
INSERT INTO Genre (GenreName)
VALUES 
('Action'),
('Comedy'),
('Drama'),
('Horror'),
('Romance');
/* 2024-11-13 13:02:59 [5 ms] */ 
INSERT INTO Movie (GenreID, MovieName, Year)
VALUES
(1, 'Action Movie', 2023),  -- Genre 1: Action
(2, 'Comedy Movie', 2024),  -- Genre 2: Comedy
(3, 'Drama Movie', 2024),   -- Genre 3: Drama
(4, 'Horror Movie', 2022),  -- Genre 4: Horror
(5, 'Romantic Movie', 2023);
/* 2024-11-13 13:03:25 [10 ms] */ 
INSERT INTO Review (Username, Stars, ReviewText, MovieID)
VALUES
('john_doe', 5, 'Great action-packed movie, loved every minute of it!', 1),
('jane_doe', 4, 'Funny and enjoyable, but a bit predictable.', 2),
('alice_smith', 3, 'Nice drama, but a bit too slow for my taste.', 3);
/* 2024-11-13 13:03:34 [5 ms] */ 
INSERT INTO Favorite (Username, MovieID)
VALUES
('john_doe', 2),  -- John Doe favors Comedy Movie
('jane_doe', 3),  -- Jane Doe favors Drama Movie
('alice_smith', 4),  -- Alice Smith favors Horror Movie
('bob_jones', 5);
/* 2024-11-13 13:03:57 [17 ms] */ 
SELECT MovieName, GenreName, Year
FROM Movie
JOIN Genre ON Movie.GenreID = Genre.GenreID LIMIT 100;
/* 2024-11-13 13:04:15 [10 ms] */ 
SELECT MovieName
FROM Movie
JOIN Favorite ON Movie.MovieID = Favorite.MovieID
WHERE Favorite.Username = 'john_doe' LIMIT 100;
/* 2024-11-13 13:04:30 [2 ms] */ 
SELECT Username, Stars, ReviewText
FROM Review
WHERE MovieID = 1 LIMIT 100;
