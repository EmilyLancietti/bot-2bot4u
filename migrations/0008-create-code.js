'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Codes', {
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            insertions: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            reports: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            transport_id: {
                type: Sequelize.STRING,
                references: {
                    model: 'Transports',
                    key: 'identifier'
                },
                allowNull: true
            },
            createdAt: {

                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Codes');
    }
};
