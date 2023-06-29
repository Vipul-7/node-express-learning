const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// const expressHbs = require("express-handlebars");

const app = express();

// for templeting engine
// app.engine("hbs", expressHbs); // for handlebars
app.set("view engine", "ejs");
app.set("views", "views");

// Order matters - in middle wares
app.use(bodyParser.urlencoded({ extended: false })); // In node js we have to do with the CHUNKS and the BUFFER // extended: false - only accept default features
app.use(express.static(path.join(__dirname, "public"))); // grant read access to the public folder // serve content statically

app.use("/admin", adminData.routes); // filter the routes
app.use(shopRoutes);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, ".", "Views", "404.html"));
  res.status(404).render("404", { pageTitle: "Page not Found" });
});

app.listen(3000);

// use() - to use the middlewares
// next(); // allow request to travel on the next middleware
