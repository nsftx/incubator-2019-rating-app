'use strict';
module.exports = (sequelize, DataTypes) => {
  const settings = sequelize.define('settings', {
    emoticonNumber: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER,
    messageTimeout: DataTypes.INTEGER,
    emoticonsGroupId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  }, {});
  settings.associate = function (models) {
    settings.hasMany(models.ratings, {
      as: 'ratings'
    });
    settings.belongsTo(models.emoticonsGroups, {
      foreignKey: 'emoticonsGroupId'
    });
    settings.belongsTo(models.users, {
      foreignKey: 'userId'
    });
    settings.belongsTo(models.messages, {
      foreignKey: 'messageId',
      as: 'message'
    });
  };
  return settings;
};