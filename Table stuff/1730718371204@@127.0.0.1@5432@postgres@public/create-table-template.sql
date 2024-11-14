-- Active: 1730718371204@@127.0.0.1@5432@postgres@public

CREATE TABLE Genre (
    GenreID SERIAL PRIMARY KEY,
    GenreName VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO Genre (GenreName)
VALUES 
('Action'),
('Comedy'),
('Drama'),
('Horror'),
('Romance');


CREATE TABLE "User" (
    UserID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    BirthYear INT CHECK (BirthYear BETWEEN 1900 AND EXTRACT(YEAR FROM CURRENT_DATE))
);

INSERT INTO "User" (Name, Username, Password, BirthYear)
VALUES
('John Doe', 'john_doe', 'password123', 1990),
('Jane Doe', 'jane_doe', 'securepass456', 1992),
('Alice Smith', 'alice_smith', 'alicePass789', 1985),
('Bob Jones', 'bob_jones', 'bobSecure2024', 1988);



CREATE TABLE Movie (
    MovieID SERIAL PRIMARY KEY,
    GenreID INT,
    MovieName VARCHAR(100) NOT NULL,
    Year INT CHECK (Year >= 1888),
    FOREIGN KEY (GenreID) REFERENCES Genre(GenreID)
);

INSERT INTO Movie (GenreID, MovieName, Year)
VALUES
(1, 'Action Movie', 2023),  -- Genre 1: Action
(2, 'Comedy Movie', 2024),  -- Genre 2: Comedy
(3, 'Drama Movie', 2024),   -- Genre 3: Drama
(4, 'Horror Movie', 2022),  -- Genre 4: Horror
(5, 'Romantic Movie', 2023); -- Genre 5: Romance



CREATE TABLE Review (
    ReviewID SERIAL PRIMARY KEY,
    Username VARCHAR(50),
    Stars INT CHECK (Stars BETWEEN 1 AND 5),
    ReviewText TEXT,
    MovieID INT,
    FOREIGN KEY (Username) REFERENCES "User"(Username),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID)
);

INSERT INTO Review (Username, Stars, ReviewText, MovieID)
VALUES
('john_doe', 5, 'Great action-packed movie, loved every minute of it!', 1),
('jane_doe', 4, 'Funny and enjoyable, but a bit predictable.', 2),
('alice_smith', 3, 'Nice drama, but a bit too slow for my taste.', 3);


CREATE TABLE Favorite (
    FavoriteID SERIAL PRIMARY KEY,
    Username VARCHAR(50),
    MovieID INT,
    FOREIGN KEY (Username) REFERENCES "User"(Username),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID),
    UNIQUE (Username, MovieID)
);

INSERT INTO Favorite (Username, MovieID)
VALUES
('john_doe', 2),  -- John Doe favors Comedy Movie
('jane_doe', 3),  -- Jane Doe favors Drama Movie
('alice_smith', 4),  -- Alice Smith favors Horror Movie
('bob_jones', 5);  -- Bob Jones favors Romantic Movie