const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    res.send(req.body)
    // if (username && password) {
    //     if (!isValid(username)) {
    //         users.push({"username": username, "password": password});
    //         return res.status(200).json({message: "User successfully registered. Now you can login"});
    //     } else {
    //         return res.status(404).json({message: "User already exists!"});
    //     }
    // }
    // return res.status(404).json({message: "Unable to register user."});
});

function getBooks() {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Something went wrong.");
        }
    });
}
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooks()
        .then(books => {
            res.send(JSON.stringify(books,null,4));
        })
        .catch(error => {
            res.status(404).json({message: error});
        });
    
});

function getSpecificBook(isbn) {
    return new Promise((resolve, reject) => {
        if (isbn > Object.keys(books).length) {
            reject("This book does not exist.");
        } else {
            resolve(books[isbn]);
        }
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getSpecificBook(isbn)
        .then(book => {
            res.send(JSON.stringify(book,null,4));
        })
        .catch(error => {
            res.status(404).json({message: error});
        });
});

function getBookFromAuthor(author) {
    return new Promise((resolve, reject) => {
        let book_array = Object.entries(books);
        let filtered_books = book_array.filter((book) => book[1].author === author);
        let book_object = Object.fromEntries(filtered_books);
        if (Object.keys(book_object).length !== 0) {
            resolve(book_object);
        } else {
            reject("This author has no books on record.");
        }
    });
}
    
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBookFromAuthor(author)
        .then(book => {
            res.send(JSON.stringify(book,null,4));
        })
        .catch(error => {
            res.status(404).json({message: error});
        });
});

function getBookFromTitle(title) {
    return new Promise((resolve, reject) => {
        let book_array = Object.entries(books);
        let filtered_books = book_array.filter((book) => book[1].title === title);
        let book_object = Object.fromEntries(filtered_books);
        if (Object.keys(book_object).length !== 0) {
            resolve(book_object);
        } else {
            reject("There is no book with this title on record.");
        }
    });
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBookFromTitle(title)
        .then(book => {
            res.send(JSON.stringify(book,null,4));
        })
        .catch(error => {
            res.status(404).json({message: error});
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
    //   if (Object.keys(books[isbn].reviews).length !== 0) {
    //     res.send(books[isbn].reviews);
    //   } else {
    //     return res.status(404).json({message: `There are no reviews under the book with ISBN: ${isbn}.`});
    //   }
});

module.exports.general = public_users;
