import express from "express";  //start

var app = express();

const port = process.env.PORT || 3001;

app.listen(3001, () => {

    console.log('The server is running!!');

});

//endpoint
app.get('/', (req, res) => {
res.send('you just called root endpooint!!');
});

// Tänne tulee kaikki koodit jotka näkyy sivulla

app.get('/user/:id', (req,res) => {
    
    console.log (req.params['id'] );
    res.json('done');

});