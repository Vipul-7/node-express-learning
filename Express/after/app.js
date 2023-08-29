const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const User = require("./models/user")

const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// const User = require("./models/user");

const mongoose = require("mongoose");
const user = require("./models/user");
require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("64ee41c12fe98ef823cd18c2")
    .then((user) => {
      req.user = user
      next()
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_CONNECT_URL)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: "Vipul",
          email: "help@vipul.com",
          cart: {
            items: []
          }
        })
        user.save();
      }
    })

    app.listen(3000)
  }).catch(err => console.log(err))