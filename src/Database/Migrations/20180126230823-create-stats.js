'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stats', {
      uuid: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('NEWID()'),
        type: Sequelize.UUID
      },
      guildId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Stats');
  }
};