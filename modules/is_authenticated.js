'use strict';

var models = require('../models');
var response = require('../modules/json_response');

module.exports = function (req, res, next) {
    var auth = req.headers['authorization'];
    if (!auth) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        response(res, null, 401);
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
                    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                    response(res, null, 403);
                } else {
                    req.session.user = token.User;
                    next();
                }
            });
        } else {
            res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
            response(res, null, 401);
        }
    }
};
