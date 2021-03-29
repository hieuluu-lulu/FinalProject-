const siteRoute = require('./site');
const userRoute = require('./user');
const courseRoute = require('./course');
const manageRoute = require('./manager');
const lessonRoute = require('./lesson');
const categoryRoute = require('./category');
// const adminRoute = require('./admin');

function route(app) {
    app.use('/manage', manageRoute);
    app.use('/lessons', lessonRoute);
    app.use('/courses', courseRoute);
    app.use('/categories', categoryRoute);
    app.use('/users', userRoute);
    // app.use('/admin',adminRoute)
    app.use('/', siteRoute);
}

module.exports = route;
