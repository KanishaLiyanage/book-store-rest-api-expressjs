const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        unique: true
    },
    authorName: String,
    abstract: String,
    publishedDate: String,
    genre: String,
    content: String,
    userID: String

});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;