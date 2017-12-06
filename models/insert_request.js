'use strict';

var async = require('async');

module.exports = function (sequelize, DataTypes) {
    var InsertRequest = sequelize.define('InsertRequest', {
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

    InsertRequest.associate = function (models) {
        InsertRequest.belongsTo(models.User, {foreignKey: 'user_id'});
    };

    // Conta le richieste valide e se uguali a 3 crea il risultato nel db
    InsertRequest.afterCreate(function (insert_request, options) {
        var models = require('../models');

        InsertRequest.findAndCountAll({
            where: {
                transport: insert_request.transport,
                code: insert_request.code,
                used: false
            }
        }).then(function (result) {
            // result.rows
            if (result.count === 3) {
                async.waterfall([
                    function (next) {
                        // Crea mezzo se non esistente
                        models.Transport
                            .findOne({
                                where: {
                                    identifier: insert_request.transport
                                }
                            })
                            .then(function (transport) {
                                if (transport === null) {
                                    // Se non esiste viene creato
                                    console.log('1/2 non esistente');
                                    console.log('Creazione 1/2...');

                                    models.Transport
                                        .create({
                                            identifier: insert_request.transport,
                                            type: isNaN(parseInt(insert_request.code)) ? 'Stazione' : 'Autobus'
                                        })
                                        .then(function (newTransport) {
                                            console.log('Mezzo aggiunto');
                                            next(null, newTransport);
                                        })
                                        .catch(function (err) {
                                            console.log('Errore aggiunta mezzo');
                                            next(err);
                                        })
                                }
                                else {
                                    // Il mezzo esiste gia
                                    console.log('Mezzo gia esistente');
                                    next(null, transport);
                                }
                            })
                            .catch(function (err) {
                                next(err);
                            })
                    },
                    function (transport, next) {
                        // Crea codice se non esistente ed associarlo ad un mezzo
                        //controllo esistenza codice
                        models.Code
                            .findOne({
                                where: {
                                    code: insert_request.code
                                }
                            })
                            .then(function (code) {
                                if (code === null) {
                                    // codice non esistente
                                    console.log('Codice non esistente.. creazione....');
                                    models.Code
                                        .create({
                                            code: insert_request.code,
                                            transport_id: transport.identifier
                                        })
                                        .then(function () {
                                            console.log('Codice creato');
                                            next(null, result.rows);
                                        })
                                        .catch(function (err) {
                                            console.log('Errore aggiunta codice');
                                            next(err);
                                        })
                                }
                                else {
                                    console.log('codice gia esistente, modifica associazione...');
                                    code
                                        .updateAttributes({
                                            transport_id: transport.identifier
                                        })
                                        .then(function () {
                                            console.log('code updated');
                                            next(null, result.rows);
                                        })
                                        .catch(function (err) {
                                            next(err);
                                        })
                                }
                            })
                            .catch(function (err) {
                                next(err);
                            })
                    },
                    function (usedInsertRequests) {
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

    return InsertRequest;
};
