const User = require('../models/usersModel');
class SiteController {
    index(req, res, next) {
        (res.locals.title = 'IFE Education'), res.render('welcome');
    }
    indexDashboard(req, res, next) {
        if (
            req.user.name == 'admin' &&
            req.user.email == 'trunghieucute99@gmail.com'
        ) {
            res.locals.title = 'Admin Page';
            res.render('admin/adminDashboard', {
                user: req.user,
            });
        } else {
            (res.locals.title = 'IFE Education'),
                res.render('dashboard', {
                    user: req.user,
                });
        }
    }
}
module.exports = new SiteController();
