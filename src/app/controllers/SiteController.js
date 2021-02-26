class SiteController {
    index(req, res, next) {
        res.locals.title = 'IFE Education',
        res.render('welcome',{
        });
    }
    indexDashboard(req, res, next) {
        res.locals.title = 'IFE Education',
        res.render('dashboard', {
            
            user: req.user
        });
    }
}
module.exports = new SiteController();
