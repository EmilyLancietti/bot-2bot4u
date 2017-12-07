'use strict';

var express = require('express');
var async = require('async');

var password_utility = require('../modules/password_utility');
var isAuthenticated = require('../modules/is_authenticated');
var response = require('../modules/json_response');

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

router.get('/favorite', isAuthenticated, function (req, res, next) {
    models.Favorite
        .findAll({
            where: {
                user_id: req.session.user.email
            }
        })
        .then(function (favorites) {
            var results = [];
            async.eachSeries(favorites, function (value, callback) {
                models.Transport
                    .findAll({
                        where: {
                            identifier: value.transport_id
                        },
                        attributes: {exclude: ['createdAt', 'updatedAt']},
                        include: [{
                            model: models.Code,
                            attributes: {exclude: ['createdAt', 'updatedAt', 'insertions', 'reports', 'transport_id']}
                        }]
                    })
                    .then(function (transports) {
                        results.push(transports);
                        callback();
                    });
            }, function (err) {
                if (err) {
                    response(res, err, 500);
                } else {
                    response(res, results, 200);
                }
            });

        })
        .catch(function (err) {
            response(res, err, 500);
        });
});


router.post('/favorite/insert', isAuthenticated, function (req, res, next) {
    models.Transport
        .findById(req.body.mezzo)
        .then(function (mezzo) {
            if (mezzo === null) {
                console.log("Mezzo non esistente");
                response(res, {message: "Il mezzo inserito non esiste"}, 404);
            } else {
                models.Favorite
                    .create({
                        user_id: req.session.user.email,
                        transport_id: req.body.mezzo
                    })
                    .then(function (favorite) {
                        response(res, favorite, 201);
                    })
                    .catch(function (err) {
                        response(res, err, 500);
                    })
            }
        })
        .catch(function (err) {
            response(res, err, 500);
        })
});

module.exports = router;
