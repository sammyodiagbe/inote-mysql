const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const MailGun = require("mailgun-js");
const Op = require("sequelize").Op;
const { validationResult } = require("express-validator");

const sendEmail = new MailGun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

let env = process.env.DEV_ENV;

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
        .then((user) => {
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
                .then((match) => {
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
                .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
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
    const errors = validationResult(req).array();
    if (errors.length > 0) {
        console.log(errors);
        req.flash("signup-error", errors[0].msg);
        return req.session.save(() => {
            res.redirect("/auth/signup");
        });
    }
    User.findOne({ where: { email } })
        .then((user) => {
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
                .then((hashedPassword) => {
                    console.log(hashedPassword);
                    return User.create({
                        name,
                        email,
                        password: hashedPassword
                    });
                })
                .then((result) => {
                    req.flash("signup-success", "Account was succesfully created");
                    return req.session.save(() => {
                        res.redirect("/auth/login");
                    });
                });
        })
        .catch((err) => console.log("error " + err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
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
        .then((user) => {
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
                from: "inoteapp@inote-note.herokuapp.com",
                to: email,
                subject: "Reset your password",
                html: `
            <h1>Reset your password</h1>
            <p>Reset your password by following this <a href="https://inote-note.herokuapp.com/auth/changepassword?t=${token}&email=${email}">Link</a></p>`
            };

            sendEmail.messages().send(email_, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                console.log(data);
            });
            return res.redirect("/auth/password-reset");
        })
        .catch((err) => res.end());
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
    const { email } = req.body;
    // find a user with the
    let token;
    User.findOne({ where: { email: email } })
        .then((user) => {
            if (!user) {
                console.log("user not found");
                return res.redirect("/auth/password-reset");
            }

            console.log("generating and setting tokens");
            // generate token and set expiration time
            token = crypto.randomBytes(32).toString("hex");
            const expirationTime = Date.now() + 36000000;
            user.userPasswordResetToken = token;
            user.userPasswordResetTokenExpiration = expirationTime;
            return user.save();
        })
        .then(() => {
            let email_ = {
                from: "inoteapp@inote-note.herokuapp.com",
                to: email,
                subject: "Reset your password",
                html: `
            <h1>Reset your password</h1>
            <p>Reset your password by following this <a href="${
                env === "production" ? "https://inote-note.herokuapp.com" : "http://localhost:3000"
            }/auth/changepassword?token=${token}&email=${email}">Link</a></p>`
            };

            sendEmail.messages().send(email_, (err, data) => {
                if (err) {
                    return console.log("We have an error: ", err);
                }
                console.log("gotten data: ", data);
            });
            return res.redirect("/auth/password-reset");
        })
        .catch((err) => {
            console.log(err);
            res.end();
        });
};

exports.getChangePassword = (req, res, next) => {
    const { token, email } = req.query;

    // this is a route that needs maximum protection
    User.findOne({
        where: {
            email: email,
            userPasswordResetToken: token,
            userPasswordResetTokenExpiration: {
                [Op.gt]: Date.now()
            }
        }
    })
        .then((user) => {
            if (!user) {
                return redirect("/auth/login");
            }
            res.render("auth/change-password", {
                isAuthenticated: null,
                user: null,
                token: token,
                email: email,
                title: "Change your password"
            });
        })
        .catch((err) => console.log(err));
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
        .then((user) => {
            if (!user) {
                return res.redirect("/auth/login");
            }
            newUser = user;
            return bcrypt.hash(password, 12);
        })
        .then((newHashedPassword) => {
            newUser.password = newHashedPassword;
            return newUser.save();
        })
        .then(() => {
            req.flash("signup-success", "Your password change was successfull, please login");
            res.redirect("/auth/login");
        })
        .then((user) => {
            if (!user) {
                return res.redirect("/auth/login");
            }
            newUser = user;
            return bcrypt.hash(password, 12);
        })
        .then((newHashedPassword) => {
            newUser.password = newHashedPassword;
            return newUser.save();
        })
        .then(() => {
            res.redirect("/auth/login");
        })
        .catch((err) => {
            console.log(err);
        });
};
