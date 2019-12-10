const Notes = require("../models/notes");

exports.getIndex = (req, res, next) => {
  Notes.findAll()
    .then(notes => {
      res.render("index", { notes, title:'welcome to inotes' });
    })
    .catch(err => console.log(error));
};

exports.getAddNewNote = (req, res, next) => {
    res.render('add-note', {
        title: "create new note"
    })
}
