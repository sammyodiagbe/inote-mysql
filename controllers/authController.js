const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransporter = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const Op = require("sequelize").Op;

// const key = "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";
const options = {
  auth: {
    api_user: "app155847868@heroku.com",
    api_key: "samsonosaro12345"
  }
};

const sendEmail = nodemailer.createTransport(sendGridTransporter(options));

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

exports.getPasswordReset = (req, res, next) => {
  res.render("password-reset", {
    user: null,
    isAuthenticated: null,
    title: "reset your passworsd",
    loginError: null,
    signupError: null
  });
};

exports.postPasswordReset = (req, res, next) => {
  const { email } = req.body;
  // find a user with the
  let token;
  User.findOne({ where: { email: email } })
    .then(user => {
      if (!user) {
        console.log("user not found");
        return res.redirect("/auth/password-reset");
      }

      // generate token and set expiration time
      token = crypto.randomBytes(32).toString("hex");
      const expirationTime = Date.now() + 36000000;
      user.userPasswordResetToken = token;
      user.userPasswordResetTokenExpiration = expirationTime;
      return user.save();
    })
    .then(() => {
      console.log("sending email");
      let email_ = {
        from: "inoteapp",
        to: email,
        subject: "Reset your password",
        html: `
            <h1>Reset your password</h1>
            <p>Reset your password by following this <a href="http://localhost:3000/auth/changepassword?t=${token}&email=${email}">Link</a></p>`
      };

      sendEmail.sendMail(email_, (err, info) => {
        if (err) {
          console.log(err);
        }
        console.log(info);
      });
      // req.flash('success', )
      return res.redirect("/auth/password-reset");
    })
    .catch(err => res.end());
};

exports.getChangePassword = (req, res, next) => {
  const { t, email } = req.query;
  res.render("auth/change-password", {
    isAuthenticated: null,
    user: null,
    token: t,
    email: email,
    title: "Change your password"
  });
};

exports.postChangePassword = (req, res, next) => {
  const { password, email, token } = req.body;
  let newUser;
  User.findOne({
    where: {
      email: email,
      userPasswordResetToken: token,
      userPasswordResetTokenExpiration: {
        [Op.gt]: Date.now()
      }
    }
  })
    .then(user => {
      if (!user) {
        return res.redirect("/auth/login");
      }
      newUser = user;
      return bcrypt.hash(password, 12);
    })
    .then(newHashedPassword => {
      newUser.password = newHashedPassword;
      return newUser.save();
    })
    .then(() => {
      res.redirect("/auth/login");
    })
    .catch(err => {
      console.log(err);
    });
};
