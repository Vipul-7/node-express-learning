const express = require("express");

const router = express.Router();
const enteredData = require("./main");

router.get("/user", (req, res, next) => {
  console.log(enteredData.data.user);
  res.render("user", { name: enteredData.data.user });
});

module.exports = router;
