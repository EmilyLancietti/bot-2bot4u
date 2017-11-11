'use strict';

module.exports = function (sequelize, DataTypes) {
    var Favorite = sequelize.define('Favorite', {
        order: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Favorite.associate = function (models) {

    };

    return Favorite;
};
