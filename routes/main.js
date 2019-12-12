const express = require("express");

const controllers = require("../controllers/mainController");
const isAuthenticated = require("../middleware/auth-status");


const { getIndex, getAddNewNote, postCreateNote } = controllers;

const router = express.Router();

router.get("/", isAuthenticated, getIndex);

// adding a new note
router.get("/add-new-note",isAuthenticated, getAddNewNote);

// submitting add request note
router.post("/create-new-note",isAuthenticated, postCreateNote);

module.exports = router;
