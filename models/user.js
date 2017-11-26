'use strict';

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        confirmation_code: {
            type: DataTypes.STRING,
            allowNull: true,
            default: 'new_code'
        }
    });

    User.associate = function (models) {
        User.hasMany(models.Token, {foreignKey: 'user_id'});
        User.hasMany(models.ReportRequest, {foreignKey: 'user_id'});
        User.hasMany(models.InsertRequest, {foreignKey: 'user_id'});
        User.hasMany(models.Feedback, {foreignKey: 'user_id'});
        User.belongsToMany(models.Transport, {
            through: models.Favorite,
            foreignKey: 'transport_id',
            otherKey: 'user_id'
        });
    };

    return User;
};
