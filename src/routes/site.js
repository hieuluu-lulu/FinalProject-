const express = require('express');
const route = express.Router();
const siteController = require('../app/controllers/SiteController');
const { ensureAuth } = require('../config/auth');
const { forwardAuth } = require('../config/auth');
route.get('/', forwardAuth, siteController.index);
route.get('/dashboard', ensureAuth, siteController.indexDashboard);
module.exports = route;
