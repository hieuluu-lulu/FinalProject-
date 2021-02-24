const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const passport = require('passport');

class UserController {
    indexLogin(req, res, next) {
        res.render('account/login');
    }
    indexRegister(req, res, next) {
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
    loginFacebook(req, res, next){
        passport.authenticate("facebook", {
            successRedirect: "/dashboard",
            failureRedirect: "/users/fail"
          })(req, res, next);
    }
    fail(req, res, next){
        res.send("Failed attempting to login")
    }
    logoutHandler(req, res, next) {
        req.logout();
        req.flash('success_message', 'You have logged out of the system');
        res.redirect('/users/login');
    }
}
module.exports = new UserController();
