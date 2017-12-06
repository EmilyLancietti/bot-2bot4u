'use strict';

var models = require('../models');

module.exports = function (req, res, next) {
    var auth = req.headers['authorization'];
    if (!auth) {
        next();
    }
    else if (auth) {
        var tmp = auth.split(' ');

        if (tmp[0] === "Bearer") {
            var token = tmp[1];

            models.Token.findOne({
                where: {
                    token: token
                },
                include: [{
                    model: models.User
                }]
            }).then(function (token) {
                if (token === null) {
                    next();
                } else {
                    req.session.user = token.User;
                    next();
                }
            });
        } else {
            next();
        }
    }
};
