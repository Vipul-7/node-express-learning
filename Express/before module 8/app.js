const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
// const expressHbs = require("express-handlebars");

const errorController = require("./controllers/error")


const app = express();

// for templeting engine
// app.engine("hbs", expressHbs); // for handlebars
app.set("view engine", "ejs");
app.set("views", "views");

// Order matters - in middle wares
app.use(bodyParser.urlencoded({ extended: false })); // In node js we have to do with the CHUNKS and the BUFFER // extended: false - only accept default features
app.use(express.static(path.join(__dirname, "public"))); // grant read access to the public folder // serve content statically

app.use("/admin", adminRoutes); // filter the routes
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);

// use() - to use the middlewares
// next(); // allow request to travel on the next middleware
