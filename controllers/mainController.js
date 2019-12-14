const Notes = require("../models/notes");

exports.getIndex = (req, res, next) => {
    req.session.prevPage = req.originalUrl;
    console.log(req.user);
    Notes.findAll()
        .then((notes) => {
            let success = req.flash("success");
            success = success.length > 0 ? success[0] : null;
            res.render("index", {
                notes,
                title: "welcome to inotes",
                success,
                isAuthenticated: req.session.isAuthenticated,
                user: req.user
            });
        })
        .catch((err) => console.log(err));
};

exports.getAddNewNote = (req, res, next) => {
    req.session.prevPage = req.originalUrl;
    res.render("add-note", {
        title: "create new note",
        isAuthenticated: req.session.isAuthenticated,
        user: req.user
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
            req.flash("success", "Your note was created successfully");
            res.redirect("/");
        })
        .catch((err) => console.log(err));
};

exports.getViewNote = (req, res, next) => {
    const { note } = req.query;
    console.log(req.user);
    Notes.findOne({ where: {id: note}})
        .then(note => {
             return res.render('view-note', { title: note.title, user: req.user, note})
        })
        .catch(err => res.redirect('/'))
    
}
