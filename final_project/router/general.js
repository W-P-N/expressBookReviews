const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password) {
      if(!isValid(username)) {
        return res.status(400).json({message: "User already registered"});
      };
      users.push({
        username: username,
        password: password
      });
      return res.status(200).json({message: `User ${username} added.`})
  } else {
    return res.status(400).json({message: "Please enter username and password."});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let book;
  Object.entries(books).forEach(([key, value]) => {
    if(value.author === author) {
        book = value;
        return;
    }
  })
  return res.send(JSON.stringify(book, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let book;
  Object.entries(books).forEach(([key, value]) => {
    if(value.title === title) {
        book = value;
        return;
    }
  })
  return res.send(JSON.stringify(book, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let bookReviews = books[isbn]['reviews'];
  return res.send(JSON.stringify(bookReviews, null, 2));
});

module.exports.general = public_users;
