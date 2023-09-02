const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  // console.log(req.get("Cookie").trim().split("=")[1]);
  // const isLoggedIn = req.get("Cookie").trim().split("=")[1];
  // console.log(req.session.isLoggedIn);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  // req.isLoggedIn = true; // this will not work because our request will be dead after sending res to user
  // res.setHeader("Set-Cookie", "isLoggedIn=true");
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        console.log("INVALID EMAIL OR PASSWORD");
        return res.redirect("/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((isMatched) => {
          if (isMatched) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              // console.log(err);
              console.log("USER AUTHENTICATED");
              res.redirect("/");
            });
          }

          console.log("INVALID EMAIL OR PASSWORD");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    // console.log(err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/");
      }
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
          cart: {
            items: [],
          },
        });

        return user.save();
      });
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
