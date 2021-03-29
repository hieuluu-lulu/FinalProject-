const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
class AdminController {
    index(req, res, next) {
        (res.locals.title = 'Admin Login'),
            res.render('admin/login', {
                user: req.admin,
            });
    }
    AdminDashboard(req, res, next) {
        {
            (res.locals.title = 'Admin Dashboard'),
                res.render('admin/adminDashboard', {
                    user: req.admin,
                });
        }
    }

    loginHandler(req, res, next) {
        passport.authenticate('admin-local', {
            successRedirect: '/admin/dashboard',
            failureRedirect: '/admin/',
            failureFlash: 'Invalid email or password',
        })(req, res, next);
    }
}
module.exports = new AdminController();
