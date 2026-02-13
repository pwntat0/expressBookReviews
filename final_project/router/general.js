const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    return res.status(404).json({message: `The book with ISBN: ${isbn} does not exist.`});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let book_array = Object.entries(books);
  let filtered_books = book_array.filter((book) => book[1].author === author);
  let book_object = Object.fromEntries(filtered_books);
  if (Object.keys(book_object).length !== 0) {
    res.send(book_object);
  } else {
    return res.status(404).json({message: `There are no books under the author: ${author}.`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let book_array = Object.entries(books);
    let filtered_books = book_array.filter((book) => book[1].title === title);
    let book_object = Object.fromEntries(filtered_books);
    if (Object.keys(book_object).length !== 0) {
      res.send(book_object);
    } else {
      return res.status(404).json({message: `There are no books under the title: ${title}.`});
    }
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
