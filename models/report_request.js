'use strict';

var async = require('async');

module.exports = function (sequelize, DataTypes) {
    var ReportRequest = sequelize.define('ReportRequest', {
        transport: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    ReportRequest.associate = function (models) {
        ReportRequest.belongsTo(models.User, {foreignKey: 'user_id'});
    };

    ReportRequest.afterCreate(function (report_request, options) {
        var models = require('../models');

        ReportRequest.findAndCountAll({
            where: {
                transport: report_request.transport,
                code: report_request.code,
                used: false
            }
        }).then(function (result) {
            // result.rows
            if (result.count >= 3) {
                async.waterfall([

                    function (next) {
                        //controllo esistenza codice
                        models.Code
                            .findOne({
                                where: {
                                    code: report_request.code
                                }
                            })
                            .then(function (code) {
                                if (code === null) {
                                    // Se il codice non esiste viene eliminata la segnalazione
                                    report_request.destroy({returning: true, checkExistance: true})
                                        .then(function (instance) {
                                            // instance = null if row has not been deleted
                                            next("Codice non esistente");
                                        })
                                        .catch(function (err) {
                                            console.log(err);
                                            next(err);
                                        })
                                }
                                else {
                                    console.log('codice gia esistente, aggiornamento affidabilita...');
                                    if (code.reports >= 2) {
                                        code.destroy({returning: true, checkExistance: true})
                                            .then(function (instance) {
                                                // instance = null if row has not been deleted
                                                next(null, result.rows);
                                            })
                                            .catch(function (err) {
                                                console.log(err);
                                                next(err);
                                            })
                                    }
                                    else {
                                        // Aggiornamento contatore
                                        code
                                            .updateAttributes({
                                                reports: code.reports + 1
                                            })
                                            .then(function () {
                                                console.log('code.reports updated');
                                                next(null, result.rows);
                                            })
                                            .catch(function (err) {
                                                next(err);
                                            })
                                    }
                                }
                            })
                            .catch(function (err) {
                                next(err);
                            })
                    },
                    function (usedReportRequests) {
                        // Segna richieste come gia' usate
                        async.each(result.rows, function (value) {
                            value
                                .updateAttributes({
                                    used: true
                                });
                        });
                    }
                ]);
            }
        });
    });

    return ReportRequest;
};
