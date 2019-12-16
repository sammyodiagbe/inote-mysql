const express = require("express");
const { check } = require("express-validator");

const router = express.Router();
const isAuthenticated = require("../middleware/auth-pages");

const controller = require("../controllers/authController");
const validators = require("../middleware/validators");
const {
    getLogin,
    getSignupHandler,
    postLoginHandler,
    postSignupHandler,
    postLogout,
    getPasswordReset,
    postPasswordReset,
    getChangePassword,
    postChangePassword
} = controller;
const { postSignupValidator } = validators;

router.get("/login", isAuthenticated, getLogin);

router.post("/login", isAuthenticated, postLoginHandler);

router.get("/signup", isAuthenticated, getSignupHandler);

router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("Field needs to be a valid email")
            .notEmpty()
            .withMessage("Email field cannot be empty"),
        check("password")
            .isLength({ min: 8 })
            .withMessage("Password length needs to be greater than or equal 8")
            .notEmpty()
            .isAlphanumeric()
            .withMessage("Password needs to be alpha numeric")
    ],
    isAuthenticated,
    postSignupHandler
);

router.post("/logout", postLogout);

router.get("/password-reset", isAuthenticated, getPasswordReset);

router.post("/password-reset", isAuthenticated, postPasswordReset);

router.get("/changepassword", isAuthenticated, getChangePassword);

router.post("/changepassword", isAuthenticated, postChangePassword);
module.exports = router;
