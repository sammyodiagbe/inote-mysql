const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("login", { title: "Login into your account" });
};

exports.postLoginHandler = (req, res, next) => {};

exports.getSignupHandler = (req, res, next) => {
  res.render("signup", {
    title: "Create your account"
  });
};

exports.postSignupHandler = (req, res, next) => {
    const { name, email, password } = req.body;
    User.findOne({ where: { email }})
        .then(user => {
            // if a user already exist in the database
            if(user) {
                console.log('user exist');
                return res.redirect('/auth/signup')
            }
            // return a promise to hash the user's password
            bcrypt.hash(password, 12)
            .then((hashedPassword) => {
                console.log(hashedPassword)
                return User.create({
                    name,
                    email,
                    password: hashedPassword
                });
            })
            .then((result) => {
                console.log(result);
                res.redirect('/auth/login');
            })
        }) 
        .catch(err => console.log('error ' + err));
}
