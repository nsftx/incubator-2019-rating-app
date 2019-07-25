module.exports = (sequelize, DataTypes) => {
    const invites = sequelize.define('invites', {
        email: DataTypes.STRING,
    }, {});
    invites.associate = (models) => {};
    return invites;
};
