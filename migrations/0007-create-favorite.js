'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Favorites', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            transport_id: {
                type: Sequelize.STRING,
                references: {
                    model: 'Transports',
                    key: 'identifier'
                },
                allowNull: false
            },
            user_id: {
                type: Sequelize.STRING,
                references: {
                    model: 'Users',
                    key: 'email'
                },
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        })
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Favorites')
    }
};
