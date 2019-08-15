module.exports = {
  up: (queryInterface) => {
    return queryInterface.addIndex('ratings', ['settingId', 'time']);
  },
  down: (queryInterface) => {
    return queryInterface.removeIndex('ratings', ['settingId', 'time']);
  },
};
