'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ratings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      time: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      settingId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'settings'
          },
          key: 'id'
        },
        allowNull: false
      },
      emoticonId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'emoticons'
          },
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false

      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false

      }
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('ratings');
  }
};