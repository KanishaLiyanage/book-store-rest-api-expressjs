const express = require('express');
require('./db/connection');

const app = express();

const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    res.send("Hello World!");
});

app.post('/register', async(req, res)=>{
    
});

app.listen(port, function () {
    console.log("Server is up on the port " + port + ".");
});