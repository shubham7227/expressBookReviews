const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//to convert book json dictionnary to an array
const booksArray = Object.values(books);


public_users.post("/register", (req,res) => {
    const {username, password} = req.body;

    if (!users.find((e) => e.username === username)) {
        const newUser = {username, password};
        users.push(newUser);
        return res.status(300).json({message: `User with username ${username} registered.`})
    }
    return res.status(402).json({message: "Username is already used"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)))
    })
    getBooks.then(() => console.log("Promise has been resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const getByISBN = new Promise((resolve, reject) => {
        const isbn = req.params.isbn;
        resolve(res.status(300).json(books[isbn]))
    })
    getByISBN.then(() => console.log("Promise has been resolved"));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const getByAuthor = new Promise((resolve, reject) => {
        const author = req.params.author;
        const book = booksArray.filter((e) => e.author === author);
        resolve(res.status(300).json(book))
    })
    getByAuthor.then(() => console.log("Promise has been resolved"));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const getByTitle = new Promise((resolve, reject) => {
        const title = req.params.title;
        const book = booksArray.filter((e) => e.title === title);
        resolve(res.status(300).json(book))
    })
    getByTitle.then(() => console.log("Promise has been resolved"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const book = books[req.params.isbn];
    return res.status(300).json(book.reviews);
});

module.exports.general = public_users;
