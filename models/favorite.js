'use strict';

module.exports = function (sequelize, DataTypes) {
    var Favorite = sequelize.define('Favorite', {
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0
        }
    });

    Favorite.associate = function (models) {

    };

    return Favorite;
};
