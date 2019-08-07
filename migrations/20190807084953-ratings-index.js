module.exports = {
  up: (queryInterface) => {
    queryInterface.addIndex('ratings', ['time', 'settings_id']);
  },
};
