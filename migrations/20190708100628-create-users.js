module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      /* first_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      }, */
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      isSuperAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
      /* googleId: {
        type: Sequelize.BIGINT,
        allowNull: false,
      }, */
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
    queryInterface.dropTable('users');
  },
};
