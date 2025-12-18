const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

public_users.post("/register", async (req,res) => {
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

// Function to implement await and async
function getBooksAsync() {
    return Promise.resolve(books);
  }

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await getBooksAsync();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({message: "Unable to fetch books."})
  }
});

// Function to implement await and async - book with isbn
function getBookWithIsbnAsync(isbn) {
    return Promise.resolve(books[isbn]);
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const response = await getBookWithIsbnAsync(isbn);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({message: "Unable to get fetch the book details."})
    }
});

// Function to implement await and async - book with isbn
function getBookWithAuthor(author) {
    return Promise.resolve(function() {
        Object.entries(books).forEach(([key, value]) => {
            if(value.author === author) {
                return value;
            }
        })
    });
}

  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await getBookWithAuthor(author);
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
      return res.status(500).json({message: "Unable to fetch book."});
  }
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
