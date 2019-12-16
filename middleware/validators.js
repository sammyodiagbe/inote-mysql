const { check } = require("express-validator");

const User = require("../models/user");
exports.postSignupValidator = () => {
    return [
        check("name", "Please enter a name without space")
            .notEmpty()
            .trim()
            .escape(),
        check("email", "Please enter a valid email")
            .isEmail()
            .nomalizeEmail()
            .body("email")
            .custom((value) => {
                return User.findOne({ where: value }).then((user) => {
                    if (user) return Promise.reject("Email is already taken");
                });
            }),
        check("password", "please enter a valid password")
            .isLength({ min: 8, max: 30 })
            .notEmpty()
            .trim()
            .escape()
    ];
};
