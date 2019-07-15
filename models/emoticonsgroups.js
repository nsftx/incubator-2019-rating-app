module.exports = (sequelize, DataTypes) => {
  const emoticonsGroups = sequelize.define('emoticonsGroups', {
    name: DataTypes.STRING,
  }, {});
  emoticonsGroups.associate = (models) => {
    emoticonsGroups.hasMany(models.emoticons);
    emoticonsGroups.hasMany(models.settings);
  };
  return emoticonsGroups;
};
