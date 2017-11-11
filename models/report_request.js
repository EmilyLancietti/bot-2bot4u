'use strict';

module.exports = function(sequelize, DataTypes) {
    var ReportRequest = sequelize.define('ReportRequest', {
        transport: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    ReportRequest.associate = function (models) {
        ReportRequest.belongsTo(models.User, {foreignKey: 'user_id'});
    };

    return ReportRequest;
};