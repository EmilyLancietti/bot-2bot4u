'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addColumn('ReportRequests', 'used', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            default: false
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('ReportRequests', 'used');
    }
};
