const model = require('../models/index');

module.exports = async (req, res, next) => {
    let user;
    const token = req.headers.authorization;
    if (token) {
        user = await model.users.findOne({
            where: {
                token,
            },
            raw: true,
        });
        next();
    }
    console.log('user:', user);
    if (!user) {
        res.status(401).json({
            error: true,
            message: 'Unauthorized',
        });
    }
};
