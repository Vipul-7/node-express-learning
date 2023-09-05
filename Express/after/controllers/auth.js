const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { text } = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const { validationResult } = require("express-validator");
require("dotenv").config();

var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD,
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
    });
  }

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

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }

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

exports.getReset = (req, res, next) => {
  const message = req.flash("error");

  res.render("auth/resetPassword", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message.length > 0 ? message[0] : null,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex"); // buffer is in hexadecimal

    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account find with this email!");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 1 * 60 * 60 * 1000; // 1 hour to miliseconds

        return user.save().then((result) => {
          res.redirect("/");

          return transporter
            .sendMail({
              from: "vipul200410116042@gmail.com",
              to: email,
              subject: "Password Reset",
              html: `
          <p>We got a password reset link from this account</p>
          <p>Click <a herf="http://localhost:3000/reset/${token}">here</a> to set new password</P>
          `,
            })
            .then((result) => console.log("EMAIL SENT SUCCESSFULLY!"))
            .catch((err) => console.log(err));
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;

  // token validation
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      const message = req.flash("error");

      res.render("auth/newPassword", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message.length > 0 ? message[0] : null,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid token!");
        return res.redirect("/login");
      }

      return bcrypt
        .hash(newPassword, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpiration = undefined;
          user.save();
        })
        .then((result) => {
          console.log("PASSWORD RESET SUCCESSFULLY");
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};
