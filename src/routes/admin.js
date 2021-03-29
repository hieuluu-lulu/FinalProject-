const express = require('express');
const route = express.Router();
const AdminController = require('../app/controllers/AdminController');
const passport = require('passport');

const { forwardAdmin, ensureAdmin } = require('../config/auth');
route.get('', forwardAdmin, AdminController.index);
route.get('/dashboard', ensureAdmin, AdminController.AdminDashboard);
route.post('', AdminController.loginHandler);
// route.get('/register', AdminController.indexRegister);
// route.post('/register', AdminController.registerHandler);
module.exports = route;
