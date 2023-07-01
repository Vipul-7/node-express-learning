const express = require("express");
const path = require("path");
const bodParser = require("body-parser");

const app = express();

const mainRoutes = require("./routes/main");
const userRoutes = require("./routes/user");

app.set("view engine", "ejs");

app.use(bodParser.urlencoded({ extended: false })); // to parse the body
app.use(express.static(path.join(__dirname, ".", "public")));

app.use(mainRoutes.routes);
app.use(userRoutes);

app.use((req, res, next) => {
  res.status(404).render("404");
});

app.listen(3000);
