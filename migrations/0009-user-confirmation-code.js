'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('Users', 'confirmation_code', {
            type: Sequelize.STRING,
            allowNull: true,
            default: 'new_code'
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('Users', 'confirmation_code');
    }
};
