const Notes = require("../models/notes");


exports.getIndex = (req, res, next) => {
    console.log(req.session.isAuthenticated);
    Notes.findAll()
        .then((notes) => {
            res.render("index", { notes, title: "welcome to inotes" });
        })
        .catch((err) => console.log(err));
};

exports.getAddNewNote = (req, res, next) => {
    res.render("add-note", {
        title: "create new note"
    });
};

exports.postCreateNote = (req, res, next) => {
    const { title, description, color } = req.body;
    Notes.create({
        title,
        description,
        color
    })
        .then((note) => {
            return note.save();
        })
        .then((done) => {
            res.redirect("/");
        })
        .catch((err) => console.log(err));
};
