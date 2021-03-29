module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) return next();
        req.flash('error_message', 'First you need to login!');
        res.redirect('/users/login');
    },
    forwardAuth: function (req, res, next) {
        //check if user is login then user can redirect to welcome page
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
    },
    forwardAdmin: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/admin/dashboard');
    },
    ensureAdmin: function (req, res, next) {
        if (req.isAuthenticated()) return next();
        req.flash('error_message', 'First you need to login!');
        res.redirect('/admin');
    },
    admin(req, res, next) {
        if (req.user.email !== 'admin@gmail.com' && req.user.name !== 'admin') {
            res.redirect('/dashboard');
        }
        next();
    },
};
