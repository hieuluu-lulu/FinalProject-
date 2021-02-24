const siteRoute = require('./site');
const userRoute = require('./user');
const courseRoute = require('./course');
const manageRoute = require('./manager');

function route(app) {
    app.use('/manage', manageRoute);
    app.use('/courses', courseRoute);
    app.use('/users', userRoute);
    app.use('/', siteRoute);
}

module.exports = route;
