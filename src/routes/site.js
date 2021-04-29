const express = require('express');
const route = express.Router();
const siteController = require('../app/controllers/SiteController');
const { ensureAuth } = require('../config/auth');
const { forwardAuth } = require('../config/auth');
route.get('/', forwardAuth, siteController.index);
route.get('/dashboard', ensureAuth, siteController.indexDashboard);
route.get('/discuss', siteController.pageNotFound);
route.get('/contact', siteController.pageNotFound);

route.get('*', siteController.pageNotFound);
module.exports = route;
