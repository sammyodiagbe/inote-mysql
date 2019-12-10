const express = require("express");

const controllers = require("../controllers/mainController");
const { getIndex, getAddNewNote } = controllers;

const router = express.Router();

router.get("/", getIndex);

// adding a new note
router.get("/add-new-note", getAddNewNote)

module.exports = router;
