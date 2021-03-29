const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const expressValidator = require('express-validator');
const methodOverride = require('method-override'); //ghi đè phương thức mặc định Post, Get của html thành DELETE,PUT,PATCH
const app = express();
const db = require('./config/dbconnect');

// passport.config
require('./config/passport')(passport);
// connect to db
db.connect();
//method override
app.use(methodOverride('_method'));
// EJS
app.use(expressLayouts);
//body parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express session
app.use(
    session({
        secret: 'secure',
        resave: true,
        saveUninitialized: true,
    }),
);
// passport  middleware
app.use(passport.initialize());
app.use(passport.session());

// connect-flash
app.use(flash());

// global variables
app.use((req, res, next) => {
    // create variable for flash to message error
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
});
app.set('view engine', 'ejs');
// static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'resources', 'views'));
// routes
const route = require('./routes');
route(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`App listening at http://localhost:${PORT}`));
