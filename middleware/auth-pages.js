module.exports = (req, res, next) => {
    if(req.session.isAuthenticated) {
        req.flash('login-error');
        return req.session.save(() => {
            res.redirect(req.session.prevPage);
        })
        
    }
    next();
}      