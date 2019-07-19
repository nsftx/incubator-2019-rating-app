module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('users', 'image', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },

  down: async (queryInterface) => {
    try {
      await queryInterface.removeColumn('users', 'image');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
