module.exports = (req, res, next) => {
    console.log('original url: ',req.originalUrl, ' url: ', req.baseUrl);
    if(!req.session.isAuthenticated) {
        return res.redirect('/auth/login');
    }
    next();
    
}