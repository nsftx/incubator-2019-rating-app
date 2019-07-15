'use strict';

module.exports = (sequelize, DataTypes) => {
  const messages = sequelize.define('messages', {
    text: DataTypes.STRING,
    language: DataTypes.STRING,
  }, {});
  messages.associate = (models) => {
    messages.hasMany(models.settings);
  };
  return messages;
};
