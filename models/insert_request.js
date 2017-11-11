'use strict';

var moment = require('moment');

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

    /*
    // Verifica che l'utente non abbia già inserito questo recordo negli ultimi 7 giorni
    InsertRequest.beforeSave(function (insert_request, options) {
        console.log(options);
        InsertRequest.count({
            where: {
                transportation: insert_request.transportation,
                code: insert_request.code,
                user_id: insert_request.user_id,
                createdAt: {
                    $gte:  moment.add(-7, 'days')
                }
            }
        }).then(function (results) {
            console.log(results);
            //return sequelize.Promise.reject(new Error("I'm afraid I can't let you do that!"));
        });
    });
    */

    // Conta le richieste valide e se uguali a 3 crea il risultato nel db
    InsertRequest.afterSave(function (insert_request, options) {
        InsertRequest.findAndCountAll({
            where: {
                transport: insert_request.transport,
                code: insert_request.code,
                used: false
            }
        }).then(function (result) {
            // result.rows
            if (result.count === 3) {
                // TODO: creare mezzo se non esistente
                // TODO: creare codice se non esistente ed associarlo ad un mezzo
                // TODO: segnare richieste come gia' usate
            }
        });
    });

    return InsertRequest;
};
