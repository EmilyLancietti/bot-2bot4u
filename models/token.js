'use strict';

module.exports = function(sequelize, DataTypes) {
    var Token = sequelize.define('Token', {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        data: {
            type: DataTypes.JSON,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['Interno', 'Facebook', 'Google']
        }
    });

    Token.associate = function (models) {
        Token.belongsTo(models.User, {foreignKey: 'user_id'});
    };

    return Token;
};
