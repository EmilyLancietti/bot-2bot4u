'use strict';

var express = require('express');
var async = require('async');

var isAuthenticated = require('../modules/is_authenticated');
var response = require('../modules/json_response');

var router = express.Router();
var models = require('../models');

router.get('/:matricola/:codice', isAuthenticated, function (req, res, next) {
    async.waterfall([
        function (next) {
            console.log('ricerca doppioni');

            var dateNow = new Date();
            dateNow.setDate(dateNow.getDate() - 7);

            models.ReportRequest
                .findAndCountAll({
                    where: {
                        transport: req.params.matricola,
                        code: req.params.codice,
                        user_id: req.session.user.email,
                        createdAt: {
                            gte: dateNow
                        }
                    }
                })
                .then(function (results) {
                    if (results.count > 0) {
                        console.log('trovati');
                        next("Already insert");
                    } else {
                        console.log('non trovati');
                        next(null);
                    }
                })
                .catch(function (err) {
                    console.log('errore', err);
                    next(err);
                });
        },
        function (next) {
            console.log('creazione');
            models.ReportRequest
                .create({
                    transport: req.params.matricola,
                    code: req.params.codice,
                    user_id: req.session.user.email
                })
                .then(function (insertRequest) {
                    console.log('ok');
                    next(null, insertRequest);
                })
                .catch(function (err) {
                    console.log('no ok');
                    next(err);
                });
        }
    ], function (err, results) {
        if (err) {
            response(res, {message: err}, 400);
        }
        else {
            response(res, results, 201);
        }
    });
});

module.exports = router;
