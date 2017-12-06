'use strict';

var express = require('express');
var password_utility = require('../modules/password_utility');
var router = express.Router();
var models = require('../models');

// Richiesta Token
router.get('/auth_token', function (req, res, next) {
    var auth = req.headers['authorization'];
    if (!auth) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.send('Need some creds son');
    }
    else if (auth) {
        var tmp = auth.split(' '); // Divido la stringa del tipo "Basic Y2hhcmxlczoxMjM0NQ=="

        var buf = new Buffer(tmp[1], 'base64');
        var plain_auth = buf.toString();

        var creds = plain_auth.split(':');
        var email = creds[0];
        var password = creds[1];

        models.User.findById(email, {
            include: [{
                model: models.Token
            }]
        }).then(function (user) {
            if (user === null) {
                res.status(404);
                res.send("User not Found");
            } else {
                password_utility.comparePassword(password, user.password, function (isPasswordMatch) {
                    if (isPasswordMatch) {
                        res.send(user.Tokens);
                    } else {
                        res.statusCode = 401;
                        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                        res.send('Access Denied');
                    }
                });
            }
        });
    }
});

module.exports = router;
