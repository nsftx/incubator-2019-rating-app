/* eslint-disable consistent-return */
const {
    OAuth2Client,
} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const model = require('../models/index');

const updateToken = async (userId, newToken) => {
    /* console.log(userId, newToken); */
    await model.users.update({
            token: newToken,
        }, {
            where: {
                id: userId,
            },
        })
        .error(error => console.log(error));
};

exports.userlogin = async (req, res) => {
    const token = req.headers.authorization;
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
            // Or, if multiple clients access the backend:
            // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const user = ticket.getPayload();

        model.users.findOne({
            where: {
                googleId: user.sub,
            },
            raw: true,
        }).then(async (currentUser) => {
            if (currentUser) {
                if (token !== currentUser.token) {
                    await updateToken(currentUser.id, token);
                }
                return res.json({
                    error: false,
                    existingUser: true,
                    data: currentUser,
                });
            }
            model.invites.findOne({
                where: {
                    email: user.email,
                },
            }).then((existingInvite) => {
                if (!existingInvite) {
                    return res.status(400).json({
                        error: true,
                        data: 'update error',
                        message: 'Invitation for user does not exist',
                    });
                }
                model.users.create({
                    googleId: user.sub,
                    firstName: user.given_name,
                    lastName: user.family_name,
                    email: user.email,
                    image: user.picture,
                    token,
                }).then((newUser) => {
                    res.json({
                        error: false,
                        existingUser: false,
                        data: newUser,
                    });
                }).catch(() => res.json({
                    error: true,
                    message: 'Error creating user!',
                }));
            }).catch(() => res.json({
                error: true,
                message: 'Login error!',
            }));
        }).catch(() => res.json({
            error: true,
            message: 'Finding user error!',
        }));
    }
    verify().catch(() => res.status(401).json({
        error: true,
        data: 'User not found or token expired',
    }));
};

exports.getUserByEmail = async (req, res) => {
    const {
        email,
    } = req.body;

    await model.users.findOne({
            where: {
                email,
            },
        })
        .then((user) => {
            if (user) {
                res.json({
                    error: false,
                    data: user,
                    message: '',
                });
            } else {
                res.status(400).json({
                    error: true,
                    data: {},
                    message: 'User not found',
                });
            }
        })
        .catch(() => res.json({
            error: true,
            data: {},
            message: 'Server error, user not found!',
        }));
};
exports.getUser = async (req, res) => {
    const {
        id,
    } = req.params;

    await model.users.findOne({
            where: {
                id,
            },
        })
        .then((user) => {
            if (user) {
                res.json({
                    error: false,
                    data: user,
                    message: '',
                });
            } else {
                res.status(400).json({
                    error: true,
                    data: {},
                    message: 'User not found',
                });
            }
        })
        .catch(() => res.json({
            error: true,
            data: {},
            message: 'Server error, user not found!',
        }));
};

exports.deleteUser = (req, res) => {
    const {
        email,
    } = req.body;
    console.log(email);

    model.users.destroy({
            where: {
                email,
            },
        })
        .then((user) => {
            if (user) {
                res.json({
                    error: false,
                    data: user,
                    message: 'User deleted',
                });
            } else {
                res.status(400).json({
                    error: true,
                    data: {},
                    message: 'User not found',
                });
            }
        })
        .catch(error => res.json({
            error: true,
            data: {},
            message: error,
        }));
};
