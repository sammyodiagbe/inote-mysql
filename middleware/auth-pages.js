module.exports = (req, res, next) => {
    console.log(req.session);
    if(req.session.isAuthenticated) return res.redirect(req.session.prevPage);
    next();
}      