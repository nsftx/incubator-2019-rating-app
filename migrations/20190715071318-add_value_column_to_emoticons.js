module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'emoticons', 'value',

      Sequelize.INTEGER,
    );
  },

  down: (queryInterface) => {
    queryInterface.removeColumn(
      'emoticons',
      'value',
    );
  },
};
