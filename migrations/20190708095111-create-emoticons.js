'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('emoticons', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      symbol: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      emoticonsGroupId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'emoticonsGroups'
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
    return queryInterface.dropTable('emoticons');
  }
};