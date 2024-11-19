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
app.get('/user/:id', async (req, res) => {
    const userId = req.params.id; // lukee ja pääsee 'id' parametriin
    console.log(`User ID received: ${userId}`);  // kun kirjoitan esim /user/123 niin hakee käyttäjän "123" tiedon.
    
    try {
        // Query the database for the user
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (result.rows.length > 0) {
            res.json({ message: 'done', user: result.rows[0] });
        } else {
            res.status(404).json({ error: 'User not found' });  //jos käyttäjää ei löydy tulee koodi 404
        }
    } catch (error) {
        res.status(500).json({ error: 'Database query failed', details: error.message }); //jos tulee jokin muu database ongelma että ei pääse käsiksi niin error 500
    }
});
