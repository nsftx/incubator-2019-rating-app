module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'last_name', 'lastName', {
      type: Sequelize.STRING,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'lastName', 'last_name', {
      type: Sequelize.STRING,
    });
  },
};
