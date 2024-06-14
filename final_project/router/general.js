const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username === "" || username === null || password === "" || password === null){
    return res.status(401).json({Error:"Username/password can not be empty"});
  }else{
    let user = users.filter((user)=>user.username === username);

    if(user.length > 0){
      return res.status(401).json({Error:"Username already exists"});
    }else{
      users.push({"username":username, "password":password});
      return res.status(200).json({message:"Customer successfully registered. Now you can login."});
    }
  }
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(200).json({books: books});
});



async function getAllBookList(){
    const result = await axios.get("http://localhost:3000");
    let bookList = result.data;
    console.log(bookList);
}


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let relevantBook = books[isbn];
  return res.status(200).json(relevantBook);
 });
  

function getBookByISBN(url){
  const req = axios.get("http://localhost:3000/isbn/1");
  req.then(resp => {
      let book = resp.data;
      console.log(book);
    })
  .catch(err => {
      console.log(err.toString())
  });
}


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let keys = Object.keys(books);
  var booksForAuthor = [];
  for (let i = 1;i<=keys.length;i++) {
    let book = books[i];
    if(book.author === author){
      booksForAuthor.push(book);
    }
  }
  if(booksForAuthor.length > 0){
    return res.status(200).json({booksbyauthor : booksForAuthor});
  }else{
    return res.status(404).json("Author Not found");
  }
});

async function getBookByAuthor(){
  const result = await axios.get("http://localhost:3000/author/Unknown");
  let books = result.data;
  console.log(books);
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let keys = Object.keys(books);
  var booksForTitle = [];
  for (let i = 1;i<=keys.length;i++) {
    let book = books[i];
    if(book.title === title){
      booksForTitle.push(book);
    }
  }
  if(booksForTitle.length > 0){
    return res.status(200).json({booksbytitle : booksForTitle});
  }else{
    return res.status(404).json("Title Not found");
  }
});

async function getBookDetailsByTitle(){
  const result = await axios.get("http://localhost:3000/title/The Book Of Job");
  let book = result.data;
  console.log(book);
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    return res.status(200).json({reviews: book.reviews});
  }else{
    return res.status(404).json("Book not found");
  }
  
});

// getAllBookList();
getBookByISBN();
// getBookByAuthor();
// getBookDetailsByTitle();
module.exports.general = public_users;
