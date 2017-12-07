'use strict';

module.exports = function (sequelize, DataTypes) {
    var Favorite = sequelize.define('Favorite', {});

    Favorite.associate = function (models) {

    };

    return Favorite;
};
