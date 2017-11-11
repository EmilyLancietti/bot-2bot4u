var models = require('../models');

function isAuthenticated(req, res, next) {
    var auth = req.headers['authorization'];
    if (!auth) {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
        res.send('Need some creds son');
    }
    else if (auth) {
        var tmp = auth.split(' ');

        // return next();
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
                    res.statusCode = 403;
                    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
                    res.send('Forbidden');
                } else {
                    req.session.user = token.User;
                    next();
                }
            });
        }
    }
}

module.exports = isAuthenticated;
