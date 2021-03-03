const User = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const async = require('async');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const config = require('../../config/config');

const CLIENT_ID = config.googleAPI.clientID;
const CLIENT_SECRET = config.googleAPI.clientSecret;
const REDIRECT_URI = config.googleAPI.redirect_URI;
const REFRESH_TOKEN = config.googleAPI.refreshToken;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
let tokenForgot;

class UserController {
    indexLogin(req, res, next) {
        res.locals.title = 'Login';
        res.render('account/login');
    }
    indexRegister(req, res, next) {
        res.locals.title = 'Resgister';
        res.render('account/register');
    }
    registerHandler(req, res) {
        const { name, email, password, password2 } = req.body;
        let errors = [];
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // check required fields
        if (!name || !email || !password || !password2) {
            errors.push({ message: 'Please fill all fields' });
        }
        if (!regex.test(email)) {
            errors.push({ message: 'Email is not valid' });
        }
        // check password length
        if (password.length < 6) {
            errors.push({ message: 'Password at least 6 characters' });
        }
        // check password match
        if (password !== password2) {
            errors.push({ message: 'Password does not match' });
        }
        if (errors.length > 0) {
            res.render('account/register', {
                errors,
                name,
                email,
                password,
                password2,
            });
        } else {
            // validate pass
            Promise.all([
                User.findOne({ name: name }),
                User.findOne({ email: email }),
            ]).then(([username, useremail]) => {
                if (username) {
                    //check user exist
                    errors.push({ message: `Name ${name} has been used` });
                    res.render('account/register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                    });
                }
                if (useremail) {
                    errors.push({ message: `Email ${email} has been used` });
                    res.render('account/register', {
                        errors,
                        name,
                        email,
                        password,
                        password2,
                    });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                    });
                    // hash password
                    bcrypt.hash(newUser.password, 10, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) => {
                                req.flash(
                                    'success_message',
                                    'Account registration is successful',
                                );
                                res.redirect('/users/login');
                            })
                            .catch((err) => console.log(err));
                    });
                }
            });
        }
    }
    loginHandler(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/login',
            failureFlash: 'Username or password is incorrect.',
        })(req, res, next);
    }
    loginFacebook(req, res, next) {
        passport.authenticate('facebook', {
            successRedirect: '/dashboard',
            failureRedirect: '/users/fail',
        })(req, res, next);
    }
    fail(req, res, next) {
        res.send('Failed attempting to login');
    }
    logoutHandler(req, res, next) {
        req.logout();
        req.flash('success_message', 'You have logged out of the system');
        res.redirect('/users/login');
    }
    //[GET : users/forgot]
    forgotPassword(req, res, next) {
        res.locals.title = 'Forgot Password';
        res.render('account/forgotPassword');
    }
    //[POST : users/forgot ]
    forgotPasswordHandler(req, res, next) {
        async.waterfall(
            [
                //create token

                function (done) {
                    crypto.randomBytes(20, (err, buf) => {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function (token, done) {
                    // check email is exist in db or not
                    User.findOne({ email: req.body.email }, (err, user) => {
                        if (!user) {
                            req.flash(
                                'error_message',
                                'No account with that email address exists.',
                            );
                            res.redirect('/users/forgot');
                        } else {
                            user.resetPasswordToken = token;
                            user.resetPasswordExpires = Date.now() + 3600000;
                            user.save(function (err) {
                                done(err, token, user);
                            });
                        }
                    });
                },
                function (token, user, done) {
                    // setting send mail by nodemailer
                    const accessToken = oAuth2Client.getAccessToken();
                    const transport = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            type: 'OAuth2',
                            user: 'trunghieucute99@gmail.com',
                            clientId: CLIENT_ID,
                            clientSecret: CLIENT_SECRET,
                            refreshToken: REFRESH_TOKEN,
                            accessToken: accessToken,
                        },
                    });
                    const mailOptions = {
                        to: user.email,
                        from: 'trunghieucute99@gmail.com',
                        subject: 'Reset Password',
                        text:
                            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://' +
                            req.headers.host +
                            '/users/reset/' +
                            token +
                            '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n',
                    };
                    transport.sendMail(mailOptions, function (err) {
                        req.flash(
                            'success_message',
                            'An e-mail has been sent to ' +
                                user.email +
                                ' with further instructions.',
                        );
                        done(err, 'done');
                    });
                },
            ],
            function (err) {
                if (err) return next(err);
                res.redirect('back');
            },
        );
    }
    // [GET: reset/:token]

    resetPasswordToken(req, res) {
        User.findOne(
            {
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { $gt: Date.now() },
            },
            (err, user) => {
                // tokenForgot = req.params.token;
                if (!user) {
                    req.flash(
                        'error_message',
                        'Password reset token is invalid or has expired.',
                    );
                    return res.redirect('/users/forgot');
                } else {
                    res.locals.title = 'Reset Password';
                    res.render('account/reset', {
                        user: req.user,
                    });
                }
            },
        );
    }
    // [POST: reset/:token]
    resetPasswordHandler(req, res, next) {
        async.waterfall(
            [
                function (done) {
                    User.findOne(
                        {
                            resetPasswordToken: req.params.token,
                            resetPasswordExpires: { $gt: Date.now() },
                        },
                        (err, user) => {
                            if (!user) {
                                req.flash(
                                    'error_message',
                                    'Password reset token is invalid or has expired.',
                                );
                                res.redirect('back');
                            } else {
                                user.resetPasswordToken = undefined;
                                user.resetPasswordExpires = undefined;

                                const newUser = new User({
                                    name: user.name,
                                    email: user.email,
                                    password: req.body.password,
                                });
                                bcrypt.hash(
                                    newUser.password,
                                    10,
                                    (err, hash) => {
                                        if (err) throw err;
                                        newUser.password = hash;
                                        newUser
                                            .save()
                                            .then((user) => {
                                                req.flash(
                                                    'success_message',
                                                    'Password changed successfully',
                                                );
                                                res.redirect('/users/login');
                                            })
                                            .catch((err) => console.log(err));
                                    },
                                );
                                // user.save(function(err) {
                                //     req.logIn(user, function(err) {
                                //         done(err, user);
                                //     });
                                // });
                            }
                        },
                    );
                },
            ],
            function (err) {
                if (err) return next(err);
                res.redirect('/users/login');
            },
        );
    }
}
module.exports = new UserController();
