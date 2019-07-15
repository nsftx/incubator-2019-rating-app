'use strict';
module.exports = (sequelize, DataTypes) => {
  const ratings = sequelize.define('ratings', {
    settingId: DataTypes.INTEGER,
    time: DataTypes.DATE,
    emoticonId: DataTypes.INTEGER
  }, {});
  ratings.associate = function (models) {
    ratings.belongsTo(models.settings, {
      foreignKey: 'settingId'
    });
    ratings.belongsTo(models.emoticons, {
      foreignKey: 'emoticonId'
    })
  };
  return ratings;
};