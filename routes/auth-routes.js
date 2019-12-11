const express = require("express");

const router = express.Router();


const controller = require("../controllers/authController");
const { getLogin, getSignupHandler, postLoginHandler, postSignupHandler} = controller;

router.get("/login", getLogin);

router.post("/login", postLoginHandler)

router.get("/signup", getSignupHandler);

router.post("/signup", postSignupHandler);

module.exports = router;