const express = require("express");

const router = express.Router();


const controller = require("../controllers/authController");
const { getLogin, getSignupHandler, postLoginHandler, postSignupHandler, postLogout} = controller;

router.get("/login", getLogin);

router.post("/login", postLoginHandler)

router.get("/signup", getSignupHandler);

router.post("/signup", postSignupHandler);
router.post("/logout", postLogout)
module.exports = router;