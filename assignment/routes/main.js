const express = require("express");

const router = express.Router();

let enteredData = {};

router.get("/", (req, res, next) => {
  res.render("main");
});

router.post("/entered-user-name", (req, res, next) => {
  enteredData = { user: req.body.user };
  console.log(req.body.user[0]);
  res.redirect("/user");
});

exports.routes = router;
exports.data = enteredData;
