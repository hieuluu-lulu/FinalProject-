module.exports = {
    ensureAuth: function (req, res, next) {
        if (req.isAuthenticated()) return next();
        req.flash('error_message', 'Trước tiên bạn cần phải đăng nhập');
        res.redirect('/users/login');
    },
    forwardAuth: function (req, res, next) {
        //check if user is login then user can redirect to welcome page
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
    },
    admin(req, res, next) {
        if (
            req.user.email !== 'hieulvtgcd17213@fpt.edu.vn' &&
            req.user.name !== 'Admin'
        ) {
            res.redirect('/dashboard');
        }
        next();
    },
};
