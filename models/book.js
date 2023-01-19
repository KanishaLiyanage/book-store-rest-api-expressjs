const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        unique: true
    },
    authorName: String,
    abtstact: String,
    publishedDate: String,
    genre: String

});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;