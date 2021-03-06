/* eslint-disable consistent-return */
const {
    OAuth2Client,
} = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const model = require('../models/index');
const response = require('../helpers/responses');

const updateToken = (userId, newToken) => {
    model.users.update({
            token: newToken,
        }, {
            where: {
                id: userId,
            },
        })
        .error(error => console.log(error));
};

exports.userlogin = (req, res) => {
    const token = req.headers.authorization;
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
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
                    return res.status(400).json(response.classic(true, {}, 'Invitation does not exist'));
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
                }).catch(() => res.json(response.classic(true, {}, 'Error creating user!')));
            }).catch(() => res.json(response.classic(true, {}, 'Login error!')));
        }).catch(() => res.json(response.classic(true, {}, 'User not found!')));
    }
    verify().catch(() => res.status(401).json(response.classic(true, {}, 'User not found or token expired!')));
};

exports.getUserByEmail = (req, res) => {
    const {
        email,
    } = req.body;

    model.users.findOne({
            where: {
                email,
            },
        })
        .then((user) => {
            if (user) {
                res.json(response.classic(false, user));
            } else {
                res.status(400).json(response.classic(true, {}, 'User not found!'));
            }
        })
        .catch(() => res.json(response.classic(true, {}, 'Server error, user not found!')));
};
exports.getUser = (req, res) => {
    const {
        id,
    } = req.params;

    model.users.findOne({
            where: {
                id,
            },
        })
        .then((user) => {
            if (user) {
                res.json(response.classic(false, user));
            } else {
                res.status(400).json(response.classic(true, {}, 'User not found!'));
            }
        })
        .catch(() => res.json(response.classic(true, {}, 'Server error, user not found!')));
};

exports.deleteUser = (req, res) => {
    const {
        email,
    } = req.body;

    model.users.destroy({
            where: {
                email,
            },
        })
        .then((user) => {
            if (user) {
                res.json(response.classic(false, user, 'User deleted'));
            } else {
                res.status(400).json(response.classic(true, {}, 'User not found!'));
            }
        })
        .catch(() => res.json(response.classic(true, {}, 'Server error, user not found!')));
};
