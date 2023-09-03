const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { text } = require("express");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "4cb78f4478c475",
    pass: "41721ac35d9184",
  },
});

exports.getLogin = (req, res, next) => {
  // console.log(req.get("Cookie").trim().split("=")[1]);
  // const isLoggedIn = req.get("Cookie").trim().split("=")[1];
  // console.log(req.session.isLoggedIn);

  const message = req.flash("error");

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message.length > 0 ? message[0] : null,
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
        req.flash("error", "Invalid email or password");
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
          req.flash("error", "Invalid email or password");
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
  const message = req.flash("error");

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "user already exits");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            cart: {
              items: [],
            },
          });

          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            from: "vipul200410116042@gmail.com",
            to: email,
            subject: "Signup successfully",
            text: "First time",
            html: "<h1>Signup successfully! Now you can login with your email ",
          });
        })
        .then((result) => console.log("EMAIL SENT SUCCESSFULLY!"))
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};
