

module.exports = (sequelize, DataTypes) => {
  const emoticons = sequelize.define('emoticons', {
    name: DataTypes.STRING,
    emoticonsGroupId: DataTypes.INTEGER,
    symbol: DataTypes.STRING,
  }, {});
  emoticons.associate = function (models) {
    emoticons.belongsTo(models.emoticonsGroups, {
      foreignKey: 'emoticonsGroupId',
      as: 'emoticonGroup',
    });
    emoticons.hasMany(models.ratings);
  };
  return emoticons;
};
