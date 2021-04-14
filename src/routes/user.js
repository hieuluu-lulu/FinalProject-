const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/userController');
const passport = require('passport');
const { validate } = require('../app/middlewares/validate');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage }).single('img');

// forgot password
router.get('/reset/:token', userController.resetPasswordToken);
router.post('/reset/:token', userController.resetPasswordHandler);
router.get('/forgot', userController.forgotPassword);
router.post('/forgot', userController.forgotPasswordHandler);

//user profile
router.get('/edit-profile', userController.indexEditProfile);
router.post(
    '/profile',
    upload,
    validate.validateUpdateProfile(),
    userController.addProfile,
);
router.get('/information', userController.indexInformation);
router.post('/change-username', userController.changeUsernameHandler);
router.get('/change-username', userController.indexChangeUsername);
router.post('/change-username', userController.changeUsernameHandler);
router.post(
    '/change-password',
    validate.validateChangePassword(),
    userController.changePasswordHandler,
);
router.get('/change-password', userController.indexChangePassword);

//login and resgister
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', userController.loginFacebook);
router.get('/fail', userController.fail);
router.get('/login', userController.indexLogin);
router.post('/login', userController.loginHandler);
router.get('/register', userController.indexRegister);
router.post('/register', userController.registerHandler);
router.get('/logout', userController.logoutHandler);

module.exports = router;
