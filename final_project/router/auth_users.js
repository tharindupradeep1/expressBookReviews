const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let user = users.filter((user)=>user.username === username);
  return (user.length > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
let user = users.filter((user)=>user.username === username);
if(user.length > 0){
  return (user[0].password === password);
}else{
  return false;
}

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(isValid(username)){
    if(authenticatedUser(username,password)){
      let accessToken = jwt.sign({
        data: username,
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken
      }
      req.session.username = username;
      return res.status(200).send({Success:"User successfully logged in"});
    }else{
      return res.status(404).json({Error: "Username / password incorrect"});
    }
  }else{
    return res.status(404).json({Error: "User not found"});
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let user = req.session.username;
  let isbn = req.params.isbn;
  let book = books[isbn];
  let review = req.body.review;
    book.reviews[user] = review;
  return res.status(200).json({Success: "User review Added"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let user = req.session.username;
  let isbn = req.params.isbn;
  let book = books[isbn];
  let userReview = book.reviews[user];
  if(userReview){
    delete book.reviews[user];
    return res.status(200).json({Success: "User review deleted successfuly"});
  }else{
    return res.status(404).json({Failure:"No review for user found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
