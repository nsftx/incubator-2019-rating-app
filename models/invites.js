module.exports = (sequelize, DataTypes) => {
    const invites = sequelize.define('invites', {
        email: DataTypes.STRING,
    }, {});
    return invites;
};
