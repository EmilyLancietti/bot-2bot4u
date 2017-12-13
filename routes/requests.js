var express = require('express');

var router = express.Router();
var response = require('../modules/json_response');
var models = require('../models');

router.get('/:matricola', function (req, res) {
    models.Transport
        .findOne({
            where: {identifier: req.params.matricola.toLowerCase()},
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: [{
                model: models.Code,
                attributes: {
                    exclude: ['insertions', 'reports', 'createdAt', 'updatedAt', 'transport_id']
                }
            }]
        })
        .then(function (transport) {
            if (transport === null) {
                response(res, null, 404);
            }
            else {
                response(res, transport, 200);
            }
        })
        .catch(function (err) {
            response(res, err, 500);
        });
});

module.exports = router;
