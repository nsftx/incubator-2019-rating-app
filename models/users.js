'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    email: DataTypes.STRING,
    isSuperAdmin: DataTypes.BOOLEAN
  }, {});
  users.associate = function (models) {
    users.hasMany(models.settings, {
      as: 'settings'
    });
  };
  return users;
};