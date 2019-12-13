module.exports = (req, res, next) => {
    if (!req.session.isAuthenticated) {
        req.flash("login-error", "You are not logged in");
        return req.session.save(() => {
            return res.redirect("/auth/login");
        });
    }
    next();
};
