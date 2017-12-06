'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('Codes', 'insertions');
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('Codes', 'insertions', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        });
    }
};
