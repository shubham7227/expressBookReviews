const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const found = users.filter((e) => e.username === username);

    if (found.length>0) {
        return true;
    }
    return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const found = users.filter((e) => e.username === username && e.password === password);

    if (found.length>0) {
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(404).json({message: "Username and password required"});
    }

    if (isValid(username) && authenticatedUser(username, password)) {
        const accessToken = jwt.sign({
            data: password
        }, 'secret', {expiresIn: 60*60});

        req.session.authorization = {
            token: accessToken,
            username
        }
        return res.status(200).json({message: "User successfully logged in"})
    }
    return res.status(208).json({message: "Invalid credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        const username = req.session.authorization['username'];
        const review = req.query.review;

        book['reviews'][username] = review;
        return res.status(200).json({message: `The review for book with ISBN ${isbn} has been added/updated`})
    }
    return res.status(404).json({message: "Book not found"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        const username = req.session.authorization['username'];
        const review = req.query.review;

        if (book['reviews'][username]) {
            delete book['reviews'][username];
        }
        return res.status(200).json({message: `The review for book with ISBN ${isbn} has been deleted`})
    }
    return res.status(404).json({message: "Book not found"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
