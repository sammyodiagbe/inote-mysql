const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let loginError = req.flash("login-error");
  loginError = loginError.length > 0 ? loginError : null;
  let signupSuccess = req.flash("signup-success");
  signupSuccess = signupSuccess.length > 0 ? signupSuccess : null;
  res.render("login", {
    title: "Login into your account",
    loginError,
    signupSuccess,
    isAuthenticated: null
  });
};

exports.postLoginHandler = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ where: { email } })
    .then(user => {
      if (!user) {
        req.flash("login-error", "Account does not exist");
        return req.session.save(() => {
          res.redirect("/auth/login");
        });
      }
      // compare password
      const userHashedPassword = user.password;
      bcrypt
        .compare(password, userHashedPassword)
        .then(match => {
          if (!match) {
            req.flash("login-error", "invalid credentials");
            return req.session.save(() => {
              res.redirect("/auth/login");
            });
          }

          req.session.isAuthenticated = true;
          req.session.user = user;
          req.flash("login-success", "you are logged in");
          req.session.save(() => {
            res.redirect("/");
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.getSignupHandler = (req, res, next) => {
  let signupError = req.flash("signup-error");
  signupError = signupError.length > 0 ? signupError : null;
  res.render("signup", {
    title: "Create your account",
    signupError,
    isAuthenticated: null
  });
};

exports.postSignupHandler = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ where: { email } })
    .then(user => {
      // if a user already exist in the database
      if (user) {
        req.flash("signup-error", "User already exit");
        return req.session.save(() => {
          res.redirect("/auth/signup");
        });
      }
      // return a promise to hash the user's password
      bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          console.log(hashedPassword);
          return User.create({
            name,
            email,
            password: hashedPassword
          });
        })
        .then(result => {
          req.flash("signup-success", "Account was succesfully created");
          return req.session.save(() => {
            res.redirect("/auth/login");
          });
        });
    })
    .catch(err => console.log("error " + err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/auth/login");
  });
};
