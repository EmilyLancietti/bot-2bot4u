'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Favorites', {
            transport_id: {
                type: Sequelize.STRING,
                references: {
                    model: 'Transports',
                    key: 'identifier'
                },
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.STRING,
                references: {
                    model: 'Users',
                    key: 'email'
                },
                allowNull: false,
                primaryKey: true
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
