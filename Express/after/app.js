const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const User = require("./models/user");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const mongoose = require("mongoose");
const user = require("./models/user");
const session = require("express-session");
const MongoDBSessionStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash"); // to display flash data and stored in session but when we used that data it will automatically removed from the session
const multer = require("multer");

const app = express();
require("dotenv").config();

const store = new MongoDBSessionStore({
  uri: process.env.MONGODB_CONNECT_URL,
  collection: "sessions",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
  // resave : false , means it is not save the session on every request
  // saveUnintialized : false means it is not saved until there is not changed session
  // we also can configure cookies here
);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err)); // inside the asynchrounous catch we can not throw error
    });
});

// app.use((req, res, next) => {
//   if (req.session.isLoggedIn) {
//     req.session.user = new User().init(req.session.user);
//   }
//   console.log("I am in the app.js running with every request");
//   next();
// });
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // res.redirect("/500");
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(process.env.MONGODB_CONNECT_URL)
  .then((result) => {
    console.log("DATABASE CONNECTED");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
