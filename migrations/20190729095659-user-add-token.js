module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'token', {
        type: Sequelize.TEXT,
        allowNull: true,
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('users', 'token');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
