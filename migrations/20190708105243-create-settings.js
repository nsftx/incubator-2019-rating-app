module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      emoticonNumber: {
        allowNull: false,
        type: Sequelize.SMALLINT,
        defaultValue: 3,
      },
      messageId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'messages',
          },
          key: 'id',
        },
        allowNull: true,
      },
      emoticonsGroupId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'emoticonsGroups',
          },
          key: 'id',
        },
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        allowNull: false,
      },
      messageTimeout: {
        allowNull: false,
        type: Sequelize.SMALLINT,
        defaultValue: 5,
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,

      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false,

      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('settings');
  },
};
