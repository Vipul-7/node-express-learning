// const http = require("http");

const express = require("express");

const app = express();

//middlewares
app.use((req, res, next) => {
  console.log("in the first Miiddleware");
  next(); // allow request to travel on the next middleware
});
// use() - to use the middlewares

app.use((req, res, next) => {
  console.log("In the second Miiddleware");
  res.send("<h1>Hi! From the express") // automatically set the header
});

// const server = http.createServer(app);

app.listen(3000);
