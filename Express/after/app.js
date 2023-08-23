const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const User = require("./models/user");

const mongoConnect = require("./util/database").mongoConnect;

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("64e64fed7834937650ed36f4")
    .then((user) => {
      req.user = user;
      next()
    })
    .catch((err) => console.log(err));
  });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
