const User = require("../models/user");

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

  User.findById("64ee41c12fe98ef823cd18c2")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((err) => {
        console.log(err);
        res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
