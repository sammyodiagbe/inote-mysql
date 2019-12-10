const express = require("express");

const controllers = require("../controllers/mainController");
const { getIndex, getAddNewNote, postCreateNote } = controllers;

const router = express.Router();

router.get("/", getIndex);

// adding a new note
router.get("/add-new-note", getAddNewNote);

// submitting add request note
router.post("/create-new-note", postCreateNote);

module.exports = router;
