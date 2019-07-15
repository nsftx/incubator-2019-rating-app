module.exports = (sequelize, DataTypes) => {
  const emoticons = sequelize.define('emoticons', {
    name: DataTypes.STRING,
    emoticonsGroupId: DataTypes.INTEGER,
    symbol: DataTypes.STRING,
    value: DataTypes.INTEGER,
  }, {});
  emoticons.associate = (models) => {
    emoticons.belongsTo(models.emoticonsGroups, {
      foreignKey: 'emoticonsGroupId',
      as: 'emoticonGroup',
    });
    emoticons.hasMany(models.ratings);
  };
  return emoticons;
};
