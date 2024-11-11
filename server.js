import express from "express";  //start

var app = express();

app.listen(3001, () => {

    console.log('The server is running!!');

});

//endpoint
app.get('/', (req, res) => {
res.send('you just called root endpooint!!');
});