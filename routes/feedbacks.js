'use strict';

var express = require('express');
var response = require('../modules/json_response');

var userExistence = require('../modules/user_existence');

var router = express.Router();
var models = require('../models');

router.post('/create', userExistence, function (req, res) {
    if (req.body.message.trim() === "") {
        response(res, {message: "Messaggio vuoto non ammesso"}, 400);
    } else {
        models.Feedback
            .create({
                message: req.body.message.trim(),
                user_id: req.session.user === undefined ? null : req.session.user.email
            })
            .then(function () {
                response(res, {message: "Feedback memorizzato"}, 201);
            })
            .catch(function (err) {
                console.log("Errore");
                response(res, err, 500);
            })
    }
});

module.exports = router;
