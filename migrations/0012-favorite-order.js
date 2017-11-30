'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('Favorites', 'order', {
            type: Sequelize.INTEGER,
            allowNull: false,
            default: 0
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('Favorites', 'order');
    }
};
