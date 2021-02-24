class SiteController {
    index(req, res, next) {
        res.render('welcome',{
        });
    }
    indexDashboard(req, res, next) {
        res.render('dashboard', {
            user: req.user
        });
    }
}
module.exports = new SiteController();
