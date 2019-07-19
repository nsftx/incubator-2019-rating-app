module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    last_name: DataTypes.STRING,
    first_name: DataTypes.STRING,
    googleId: DataTypes.BIGINT,
    email: DataTypes.STRING,
    isSuperAdmin: DataTypes.BOOLEAN,
  }, {});
  users.associate = (models) => {
    users.hasMany(models.settings, {
      as: 'settings',
    });
  };
  return users;
};
