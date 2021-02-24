const express = require('express');
const route = express.Router();
const userController = require('../app/controllers/userController');
const passport = require('passport')

route.get('/auth/facebook', passport.authenticate('facebook'));
route.get('/auth/facebook/callback', userController.loginFacebook);
route.get('/fail',userController.fail);
route.get('/login', userController.indexLogin);
route.post('/login', userController.loginHandler);
route.get('/register', userController.indexRegister);
route.post('/register', userController.registerHandler);
route.get('/logout', userController.logoutHandler);

module.exports = route;
