'use strict';

var express = require('express');
var async = require('async');

var isAuthenticated = require('../modules/is_authenticated');
var response = require('../modules/json_response');

var router = express.Router();
var models = require('../models');


router.post('/email_confirmation', function (req, res) {
    models.User
        .findById(req.body.email)
        .then(function (user) {
            if (user === null) {
                response(res, {message: "Utente non trovato"}, 404);
            } else {
                if (user.confirmation_code === req.body.code) {
                    // Attivare account
                    user
                        .updateAttributes({
                            confirmation_code: null
                        })
                        .then(function () {
                            // Recupero token per accesso diretto
                            user
                                .reload({
                                    include: [{
                                        model: models.Token,
                                        where: {
                                            type: 'Interno'
                                        }
                                    }]
                                })
                                .then(function (user_token) {
                                    response(res, {
                                        message: "Account attivato",
                                        token: user_token.Tokens[0].token
                                    }, 200);
                                })
                                .catch(function (err) {
                                    response(res, err, 500);
                                });
                        })
                        .catch(function (err) {
                            response(res, err, 500);
                        })
                } else {
                    // Errore nel codice
                    response(res, {message: "Codice non valido"}, 400);
                }
            }
        })
        .catch(function (err) {
            response(res, err, 500);
        })
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
