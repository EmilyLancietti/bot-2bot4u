var express = require('express');
var session = require('express-session');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//app.set('json replacer');
app.use(session({
    secret: 'j2dfn923dnSFnnf£%eun!scefwfnCC_3',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

// Configuring Passport
var passport = require('passport');
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

// APIs
var users = require('./routes/users');
var passport_routes = require('./routes/passport')(passport);
var inserts = require('./routes/inserts');
var reports = require('./routes/reports');
var feedbacks = require('./routes/feedbacks');

app.use('/api/v1/users', users);
app.use('/api/v1/users', passport_routes);
app.use('/api/v1/inserts', inserts);
app.use('/api/v1/reports', reports);
app.use('/api/v1/feedbacks', feedbacks);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.send(err);
});

module.exports = app;
