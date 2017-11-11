'use strict';

module.exports = function (sequelize, DataTypes) {
    var Transport = sequelize.define('Transport', {
        identifier: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        type: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['Stazione', 'Autobus', 'Corriera']
        }
    });

    Transport.associate = function (models) {
        Transport.hasMany(models.Code, {foreignKey: 'transport_id'});
        Transport.belongsToMany(models.User, {
            through: models.Favorite,
            foreignKey: 'transport_id',
            otherKey: 'user_id'
        });
    };

    return Transport;
};
