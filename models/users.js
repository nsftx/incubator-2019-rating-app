module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    lastName: DataTypes.STRING,
    firstName: DataTypes.STRING,
    googleId: DataTypes.STRING,
    email: DataTypes.STRING,
    isSuperAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    token: DataTypes.STRING,
  }, {});
  users.associate = (models) => {
    users.hasMany(models.settings, {
      as: 'settings',
    });
  };
  return users;
};
