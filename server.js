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

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    try {
        // Query the database to get the paginated users
        const result = await pool.query('SELECT * FROM "User" LIMIT $1 OFFSET $2', [limit, startIndex]);

        // Query to get the total number of users
        const totalResult = await pool.query('SELECT COUNT(*) FROM "User"');
        const totalUsers = totalResult.rows[0].count;

        // Respond with paginated users and total count
        res.json({
            page: Number(page),
            limit: Number(limit),
            totalUsers: totalUsers,
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message });
    }
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

app.get('/movie', async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    console.log(`Fetching movies for page: ${page}`);
    
    try {
        const result = await pool.query('SELECT * FROM "movie" LIMIT $1 OFFSET $2', [limit, (page - 1) * limit]);
        const totalResult = await pool.query('SELECT COUNT(*) FROM "movie"'); // Get the total count of movies

        const totalMovies = totalResult.rows[0].count;

        res.json({
            page: Number(page),
            limit: Number(limit),
            totalMovies: totalMovies,
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message });
    }
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
    
    try {
        const result = await pool.query('SELECT * FROM "favorite" LIMIT $1 OFFSET $2', [limit, (page - 1) * limit]);
        const totalResult = await pool.query('SELECT COUNT(*) FROM "favorite"'); // Get the total count of favorites

        const totalFavorites = totalResult.rows[0].count;

        res.json({
            page: Number(page),
            limit: Number(limit),
            totalFavorites: totalFavorites,
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message });
    }
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
    
    try {
        const result = await pool.query('SELECT * FROM "review" LIMIT $1 OFFSET $2', [limit, (page - 1) * limit]);
        const totalResult = await pool.query('SELECT COUNT(*) FROM "review"'); // Get the total count of reviews

        const totalReviews = totalResult.rows[0].count;

        res.json({
            page: Number(page),
            limit: Number(limit),
            totalReviews: totalReviews,
            data: result.rows,
        });
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message });
    }
});



app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, timestamp: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
