const path = require("path");

const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  // res.send("<h1>Hi! This is a home Page"); // automatically set the header

  res.sendFile(path.join(__dirname, "..", "views", "shop.html")); // __dirname give us the absolute path to the current file
});

module.exports = router;
