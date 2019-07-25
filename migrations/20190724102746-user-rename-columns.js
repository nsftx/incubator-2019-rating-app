module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'first_name', 'firstName', {
      type: Sequelize.STRING,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('users', 'firstName', 'first_name', {
      type: Sequelize.STRING,
    });
  },
};
