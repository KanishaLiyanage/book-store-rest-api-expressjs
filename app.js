const express = require('express');
const bodyParser = require('body-parser');
require('./db/connection');
const User = require('./models/user');
const Book = require('./models/book');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.post('/register', async (req, res) => {

    const user = new User(req.body);
    console.log(req.body);

    //incoming body data storing in a constant user with the help of above JSON parse code.
    try {
        await user.save();
        res.status(201).send(user); //save the user in our mongoDB database
    } catch (e) {
        res.status(400).send(e); //if data validating failed this 400 status will shown up.
    }

});

app.post('/login', async (req, res) => {



});

app.get('/seeallusers', async (req, res) => {

    try {
        let users = await User.find();
        res.status(200).send(users);
    } catch (e) {
        res.status(404).send(e);
    }

});

app.post('/addbook', async (req, res) => {

    const book = new Book(req.body);

    try {
        await book.save();
        res.status(201).send(book);
    } catch (e) {
        res.status(404).send(e);
    }

});

app.get('/seeallbooks', async (req, res) => {

    try {
        let books = await Book.find();
        res.status(200).send(books);
    } catch (e) {
        res.status(404).send(e);
    }

});

app.listen(port, function () {
    console.log("Server is up on the port " + port + ".");
});