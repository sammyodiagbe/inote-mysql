const express = require("express");

const router = express.Router();
const isAuthenticated = require("../middleware/auth-pages");

const controller = require("../controllers/authController");
const {
  getLogin,
  getSignupHandler,
  postLoginHandler,
  postSignupHandler,
  postLogout,
  getPasswordReset,
  postPasswordReset
} = controller;

router.get("/login", isAuthenticated, getLogin);

router.post("/login", isAuthenticated, postLoginHandler);

router.get("/signup", isAuthenticated, getSignupHandler);

router.post("/signup", isAuthenticated, postSignupHandler);

router.post("/logout", postLogout);

router.get("/password-reset", isAuthenticated, getPasswordReset);

router.post("/password-reset", isAuthenticated, postPasswordReset);
module.exports = router;
