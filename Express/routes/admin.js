const path = require("path");

const express = require("express");

const router = express.Router();

router.get("/add-product", (req, res, next) => {
  // res.send(
  //   '<form action="product" method="POST"><input type="text" name="product"/><button>Add Product</button></form>'
  // ); // automatically set the header
  // next();

  res.sendFile(path.join(__dirname, "..", "Views", "add-product.html")); // __dirname give us the absolute path to the current file
});

router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/"); // instead of using the status code and setHeader
});

module.exports = router;
