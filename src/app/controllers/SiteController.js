const User = require('../models/usersModel');
class SiteController {
    index(req, res, next) {
        (res.locals.title = 'IFE Education'),
            res.render('welcome', {
                user: req.user,
            });
    }
    indexDashboard(req, res, next) {
        if (req.user.name === 'admin' && req.user.email === 'admin@gmail.com') {
            (res.locals.title = 'Admin Dasboard'),
                res.render('admin/adminDashboard', {
                    user: req.user,
                });
        } else {
            res.locals.title = 'IFE Education';
            res.render('dashboard', {
                user: req.user,
            });
        }
    }
    pageNotFound(req, res, next) {
        res.locals.title = 'Page Not Found';
        res.status(404).render('partials/pageNotFound', {
            user: req.user,
        });
    }
}
module.exports = new SiteController();
