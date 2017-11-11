'use strict';

module.exports = function(sequelize, DataTypes) {
    var Feedback = sequelize.define('Feedback', {
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Feedback.associate = function (models) {
        Feedback.belongsTo(models.User, {foreignKey: 'user_id'});
    };

    return Feedback;
};
