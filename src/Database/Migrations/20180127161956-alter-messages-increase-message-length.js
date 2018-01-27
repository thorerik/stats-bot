'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Messages', 'message', {
      type: Sequelize.STRING(4000),
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Messages', 'message', {
      type: Sequelize.STRING,
      allowNull: false
    })
  }
};
