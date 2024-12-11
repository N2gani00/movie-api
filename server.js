import express from 'express'; //alottaa mun express sovelluksen
import pkg from 'pg';
const { Pool } = pkg;  //pool on database yhteyksiä varten.

const app = express();

// mihin porttiin localhost tehdään.
const port = process.env.PORT || 3001;  //jos porttia ei määritellä default on 3001

// määritellään database configuraatio
const pool = new Pool({
    user: 'postgres',         // Your database username
    host: '127.0.0.1',        // Host of your database
    database: 'postgres',     // Database name
    password: '9991',         // Database password
    port: 5432,               // PostgreSQL port
});

app.use(express.json()); //jos ei ole tätä niin ei voi lukea req komentoja

// alotetaan serveri
app.listen(port, () => {
    console.log(`The server is running on port ${port}!!`);  //lukee riviltä 8 tiedon const = port osaa lukea 3001
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('You just called the root endpoint!!');  //Req kuvaa tulevaa tietoa / pyyntöä. res kuvaa serverin lähettämää vastausta.
});

// GET Endpoint käsitellään user ID
app.get('/User/:id', async (req, res) => {
    const userId = req.params.id; // Get user ID from the URL
    console.log(`User ID received: ${userId}`);  // Logs the received user ID
    
    try {
        // Use the exact case-sensitive name for the column
        const result = await pool.query('SELECT * FROM "User" WHERE "userid" = $1', [userId]);
        if (result.rows.length > 0) {
            res.json({ message: 'done', user: result.rows[0] });
        } else {
            res.status(404).json({ error: 'User not found' });  // If no user is found, return 404
        }
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message }); // Return 500 on error
    }
});

app.get('/users', async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    console.log(`Fetching users for page: ${page}`);

    // Dummy user data (replace with actual DB query)
    const dummyUsers = [
        { userid: 1, username: 'john_doe' },
        { userid: 2, username: 'jane_smith' },
        { userid: 3, username: 'bob_jones' },
        { userid: 4, username: 'alice_doe' },
        { userid: 5, username: 'charlie_brown' },
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedUsers = dummyUsers.slice(startIndex, endIndex);

    res.json({
        page: Number(page),
        limit: Number(limit),
        totalUsers: dummyUsers.length,
        data: paginatedUsers,
    });
});



app.get('/movie/:movieid', async (req, res) => {
    const movieid = req.params.movieid;
    console.log(`Movie id received:) ${movieid}`);
try {
    // Use the exact case-sensitive name for the column
    const result = await pool.query('SELECT * FROM "movie" WHERE "movieid" = $1', [movieid]);

    if (result.rows.length > 0) {
        res.json({ message: 'done', movie: result.rows[0] });
    } else {
        res.status(404).json({ error: 'movie not found' });  // If no movie is found, return 404
    }
} catch (error) {
    res.status(500).json({ error: 'Database query failed', details: error.message }); // Return 500 on error
}
});

// Get all movies (paginated) using dummy data
app.get('/moviename', (req, res) => {
    const { page = 1, limit = 5 } = req.query; // Get page number and limit from query, defaults to 1 and 5
    console.log(`Fetching movies for page: ${page}`);
    
    // Dummy movie data matching your database structure
    const dummyMovies = [
        { movieid: 1, genreid: 1, moviename: 'Action Movie', year: 2023 },
        { movieid: 2, genreid: 2, moviename: 'Comedy Movie', year: 2024 },
        { movieid: 3, genreid: 3, moviename: 'Drama Movie', year: 2024 },
        { movieid: 4, genreid: 4, moviename: 'Horror Movie', year: 2022 },
        { movieid: 5, genreid: 5, moviename: 'Romantic Movie', year: 2023 },
    ];

    // Calculate pagination range
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Get the paginated movies
    const paginatedMovies = dummyMovies.slice(startIndex, endIndex);

    // Send paginated response
    res.json({
        page: Number(page),
        limit: Number(limit),
        totalMovies: dummyMovies.length,
        data: paginatedMovies,
    });
});


app.post('/movie', (req, res) => {
    const { moviename, year, genreid } = req.body; // elokuvan tiedot
    console.log(`Adding new movie: Name=${moviename}, Year=${year}, Genre=${genreid}`);
    res.status(201).json({ message: 'Movie added', movieid: 1 });
});

app.get('/genre/:genreid', async (req, res) => {
    const genreid = req.params.genreid;
    console.log(`Movie id received:) ${genreid}`);
try {
    // Use the exact case-sensitive name for the column
    const result = await pool.query('SELECT * FROM "genre" WHERE "genreid" = $1', [genreid]);
    
    if (result.rows.length > 0) {
        res.json({ message: 'done', genre: result.rows[0] });
    } else {
        res.status(404).json({ error: 'genre not found' });  // If no movie is found, return 404
    }
} catch (error) {
    res.status(500).json({ error: 'Database query failed', details: error.message }); // Return 500 on error
}
});

app.get('/genre', async (req, res) => {
    const { page = 1, limit = 5 } = req.query; // Get page number and limit from query
    console.log(`Fetching genres for page: ${page}`);
    
    try {
        const result = await pool.query('SELECT * FROM "genre" LIMIT $1 OFFSET $2', [limit, (page - 1) * limit]);
        const totalResult = await pool.query('SELECT COUNT(*) FROM "genre"'); // Get the total count of genres

        const totalGenres = totalResult.rows[0].count;

        res.json({
            page: Number(page),
            limit: Number(limit),
            totalGenres: totalGenres,
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message });
    }
});



app.post('/genre', (req, res) => {
    const { genrename }  = req.body; //haetaan genren nimi netistä.
    console.log(`Adding new genre: ${genrename}`);
    res.status(201).json({ message: 'Genre added', genreid: 1}); // Tämä on se itse dummy response
});

app.get('/favorite/:favoriteid', async (req, res) => {
    const favoriteid = req.params.favoriteid;
    console.log(`Favorite ID received: ${favoriteid}`);
    
    try {
        // Use the lowercase table and column names
        const result = await pool.query('SELECT * FROM "favorite" WHERE "favoriteid" = $1', [favoriteid]);
        
        if (result.rows.length > 0) {
            res.json({ message: 'done', favorite: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Favorite not found' });  // If no favorite is found, return 404
        }
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message }); // Return 500 on error
    }
});

app.get('/favorite', async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    console.log(`Fetching favorites for page: ${page}`);

    // DB query
    const dummyFavorites = [
        { favoriteid: 1, movieid: 1, userid: 1 },
        { favoriteid: 2, movieid: 2, userid: 2 },
        { favoriteid: 3, movieid: 3, userid: 3 },
        { favoriteid: 4, movieid: 4, userid: 4 },
        { favoriteid: 5, movieid: 5, userid: 5 },
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedFavorites = dummyFavorites.slice(startIndex, endIndex);

    res.json({
        page: Number(page),
        limit: Number(limit),
        totalFavorites: dummyFavorites.length,
        data: paginatedFavorites,
    });
});


app.get('/review/:reviewid', async (req, res) => {
    const reviewid = req.params.reviewid;
    console.log(`Review ID received: ${reviewid}`);
    
    try {
        // Use the lowercase table and column names
        const result = await pool.query('SELECT * FROM "review" WHERE "reviewid" = $1', [reviewid]);
        
        if (result.rows.length > 0) {
            res.json({ message: 'done', reviewid: result.rows[0] });
        } else {
            res.status(404).json({ error: 'Review not found' });  // If no favorite is found, return 404
        }
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message }); // Return 500 on error
    }
});

app.post('/review', (req, res) => {
    const { username, stars, reviewtext, movieid } = req.body; // Expecting review details
    console.log(`Adding review for movie ID ${movieid}: Username=${username}, Stars=${stars}`);
    res.status(201).json({ message: 'Review added', reviewId: 1 }); // Dummy response
});

app.get('/review', async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    console.log(`Fetching reviews for page: ${page}`);

    // Dummy review data (replace with actual DB query)
    const dummyReviews = [
        { reviewid: 1, movieid: 1, username: 'john_doe', rating: 5, review: 'Great movie!' },
        { reviewid: 2, movieid: 2, username: 'jane_smith', rating: 4, review: 'Very funny!' },
        { reviewid: 3, movieid: 3, username: 'bob_jones', rating: 3, review: 'Okay, but predictable.' },
        { reviewid: 4, movieid: 4, username: 'alice_doe', rating: 2, review: 'Not scary enough.' },
        { reviewid: 5, movieid: 5, username: 'charlie_brown', rating: 5, review: 'Romantic and touching.' },
    ];

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedReviews = dummyReviews.slice(startIndex, endIndex);

    res.json({
        page: Number(page),
        limit: Number(limit),
        totalReviews: dummyReviews.length,
        data: paginatedReviews,
    });
});


app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, timestamp: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
