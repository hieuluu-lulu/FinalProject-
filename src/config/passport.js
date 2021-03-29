const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const config = require('../config/config');
const FacebookStrategy = require('passport-facebook').Strategy;

// Load User model
const User = require('../app/models/usersModel');

module.exports = (passport) => {
    //users
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' },
            (email, password, done) => {
                // Match user
                User.findOne({ email: email })
                    .then((user) => {
                        if (!user) {
                            //   return done(null, false, { message: 'That email is not registered or incorrect' });
                            return done(null, false);
                        }
                        // Match password
                        bcrypt.compare(
                            password,
                            user.password,
                            (err, isMatch) => {
                                if (err) throw err;
                                if (isMatch) {
                                    return done(null, user);
                                } else {
                                    // return done(null, false, { message: 'Password incorrect' });
                                    return done(null, false);
                                }
                            },
                        );
                    })
                    .catch((err) => console.log(err));
            },
        ),
    );
    //admin
    // passport.use(
    //   "admin-local",
    //   new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    //     // Match user
    //     Admin.findOne({ email: email })
    //       .then((admin) => {
    //         if (!admin) {
    //           //   return done(null, false, { message: 'That email is not registered or incorrect' });
    //           return done(null, false);
    //         }
    //         // Match password
    //         bcrypt.compare(password, admin.password, (err, isMatch) => {
    //           if (err) throw err;
    //           if (isMatch) {
    //             return done(null, admin);
    //           } else {
    //             // return done(null, false, { message: 'Password incorrect' });
    //             return done(null, false);
    //           }
    //         });
    //       })
    //       .catch((err) => console.log(err));
    //   })
    // );
    passport.use(
        new FacebookStrategy(
            {
                clientID: config.facebookAuth.facebook_key,
                clientSecret: config.facebookAuth.facebook_secret,
                callbackURL: config.facebookAuth.callback_url,
                profileFields: [
                    'id',
                    'displayName',
                    'email',
                    'first_name',
                    'last_name',
                    'middle_name',
                ],
            },
            function (accessToken, refreshToken, profile, done) {
                console.log(profile, typeof profile.id);
                process.nextTick(function () {
                    User.findOne({ facebookId: profile.id }, (err, user) => {
                        if (err) return done(err);

                        if (user) {
                            return done(null, user);
                        } else {
                            const {
                                id,
                                email,
                                first_name,
                                last_name,
                            } = profile._json;
                            var newUser = new User();

                            newUser.facebookId = id;
                            newUser.name = first_name + ' ' + last_name;
                            newUser.email = email;

                            newUser.save((err) => {
                                if (err) throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                });
            },
        ),
    );
    // passport.serializeUser(function(user, done) {
    //     done(null, user);
    //   });

    // passport.deserializeUser(function(obj, done) {
    //   done(null, obj);
    // });
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    // function SessionConstructor(userId, userGroup, details) {
    //   this.userId = userId;
    //   this.userGroup = userGroup;
    //   this.details = details;
    // }
    //   passport.serializeUser(function (userObject, done) {
    //     // userObject could be a Model1 or a Model2... or Model3, Model4, etc.
    //     let userGroup = "user";
    //     let userPrototype =  Object.getPrototypeOf(userObject);
    //     if (userPrototype === User.prototype) {
    //       userGroup = "user";
    //     } else if (userPrototype === Admin.prototype) {
    //       userGroup = "admin";
    //     }
    //     let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
    //     done(null,sessionConstructor);
    //   });
    //   passport.deserializeUser(function (sessionConstructor, done) {
    //     if (sessionConstructor.userGroup == 'user') {
    //       User.findOne({
    //           _id: sessionConstructor.userId
    //       }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
    //           done(err, user);
    //       });
    //     } else if (sessionConstructor.userGroup == 'admin') {
    //       Admin.findOne({
    //           _id: sessionConstructor.userId
    //       }, '-localStrategy.password', function (err, user) { // When using string syntax, prefixing a path with - will flag that path as excluded.
    //           done(err, user);
    //       });
    //     }
    //   });
};
