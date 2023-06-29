const path = require("path");

const express = require("express");
const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  // // res.send("<h1>Hi! This is a home Page"); // automatically set the header
  // console.log(adminData.data);

  // res.sendFile(path.join(__dirname, "..", "views", "shop.html")); // __dirname give us the absolute path to the current file

  const productData = adminData.data;
  res.render("shop", { prods: productData, pageTitle: "Shop" ,path:"/"}); // to use default templating engine
});

module.exports = router;
