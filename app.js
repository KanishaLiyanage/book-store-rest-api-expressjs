const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    // secret: process.env.SECRET,
    secret: "BOOKSTORESECRET",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

require('./db/connection');

const User = require('./models/user');
const Book = require('./models/book');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post('/register', async (req, res) => {

    const uname = req.body.username;
    const uemail = req.body.email;
    const upw = req.body.password;

    try {
        await User.register(
            { username: uname, email: uemail },
            upw,
            async (err, user) => {
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                    //res.redirect('/register');
                } else {
                    await passport.authenticate('local')(req, res, function () {
                        res.status(201).send(user);
                        //res.redirect('/home');
                    });
                }
            }
        );
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }

});

app.post('/login', async (req, res) => {

    try {
        const uname = req.body.username;
        const upw = req.body.password;

        const user = new User({
            username: uname,
            password: upw
        });

        req.login(user, async (err) => {
            if (err) {
                console.log(err);
            } else {
                await passport.authenticate('local')(req, res, function () {
                    res.status(200).send(user);
                    //res.redirect('/home');
                });
            }
        });
    } catch (e) {
        console.log(e);
    }

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

    try {
        User.findById("63c9f257e49cf79863e1da71", async (err, foundUser) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if (foundUser) {
                    const book = new Book({
                        title: req.body.title,
                        authorName: req.body.authorName,
                        abstract: req.body.abstract,
                        publishedDate: req.body.publishedDate,
                        genre: req.body.genre,
                        content: req.body.content,
                        userID: foundUser._id
                    });
                    await book.save();
                    res.status(201).send(book);
                } else {
                    res.status(400).send("User not found!");
                }
            }
        });
    } catch (e) {
        res.status(404).send(e);
    }

    // try {
    //     if (await req.isAuthenticated()) {
    //         User.findById(req.user.id, async (err, foundUser) => {
    //             if (err) {
    //                 res.status(400).send(err);
    //             } else {
    //                 if (foundUser) {
    //                     userid = foundUser._id;
    //                     const book = new Book({
    //                         title: req.body.title,
    //                         authorName: req.body.authorName,
    //                         abstract: req.body.abstract,
    //                         publishedDate: req.body.publishedDate,
    //                         genre: req.body.genre,
    //                         content: req.body.content,
    //                         userID: userid
    //                     });
    //                     await book.save();
    //                     res.status(201).send(book);
    //                 } else {
    //                     res.status(400).send("User not found!");
    //                 }
    //             }
    //         });
    //     } else {
    //         res.status(400).send("Please login!");
    //     }
    // } catch (e) {
    //     res.status(404).send(e);
    // }

});

app.get('/seeallbooks', async (req, res) => {

    try {
        let books = await Book.find();
        res.status(200).send(books);
    } catch (e) {
        res.status(404).send(e);
    }

});

app.patch('/updatebook/:bookid', async (req, res) => {

    const id = req.params.bookid;

    try {
        if (await req.isAuthenticated()) {
            const book = await Book.findByIdAndUpdate(id, req.body);
            if (book) {
                res.status(200).send("Successfully updated.");
            } else {
                res.status(404).send("Failed to update!");
            }
        } else {
            res.send("Please login!");
            //res.redirect('/login');
        }
    } catch (e) {
        res.status(400).send(e);
    }

});

app.delete('/deletebook/:bookid', async (req, res) => {

    const id = req.params.bookid;

    try {
        if (await req.isAuthenticated()) {
            const book = await Book.findByIdAndDelete(id);
            if (book) {
                res.status(200).send("Successfully deleted.");
            } else {
                res.status(404).send("Failed to delete!");
            }
        } else {
            res.send("Please login!");
            //res.redirect('/login');
        }
    } catch (e) {
        res.status(404).send(e);
    }
});

app.listen(port, function () {
    console.log("Server is up on the port " + port + ".");
});