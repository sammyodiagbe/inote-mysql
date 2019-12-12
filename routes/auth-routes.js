const express = require("express");

const router = express.Router();
const isAutheticated = require("../middleware/auth-pages");


const controller = require("../controllers/authController");
const { getLogin, getSignupHandler, postLoginHandler, postSignupHandler, postLogout} = controller;

router.get("/login",isAutheticated, getLogin);

router.post("/login",isAutheticated, postLoginHandler)

router.get("/signup",isAutheticated, getSignupHandler);

router.post("/signup",isAutheticated, postSignupHandler);
router.post("/logout", postLogout)
module.exports = router;