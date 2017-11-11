'use strict';

module.exports = function(sequelize, DataTypes) {
    var Code = sequelize.define('Code', {
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        insertions: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        reports: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });

    Code.associate = function (models) {
        Code.belongsTo(models.Transport, {foreignKey: 'transport_id'});
    };

    return Code;
};
