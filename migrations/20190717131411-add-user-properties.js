module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'googleId', {
        type: Sequelize.STRING(30),
        allowNull: false,
      });
      await queryInterface.addColumn('users', 'first_name', {
        type: Sequelize.STRING(50),
        allowNull: false,
      });
      await queryInterface.addColumn('users', 'last_name', {
        type: Sequelize.STRING(50),
        allowNull: false,
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('users', 'googleId');
      await queryInterface.removeColumn('users', 'first_name');
      await queryInterface.removeColumn('users', 'last_name');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
