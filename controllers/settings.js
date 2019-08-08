const model = require('../models/index');
const io = require('../server');

const getEmoticonsForSettings = async (emoticonsGroupId, emoticonNumber) => {
    const emoticons = await model.emoticons.findAll({
        where: {
            emoticonsGroupId,
        },
        attributes: ['id', 'name', 'value', 'symbol'],
        raw: true,
    });
    let filteredEmoticons = [];
    if (emoticonNumber === 3) {
        for (let i = 0; i < emoticons.length; i += 2) {
            filteredEmoticons.push(emoticons[i]);
        }
    } else if (emoticonNumber === 4) {
        const middleElementIndex = parseInt(emoticons.length / 2, 10);
        filteredEmoticons = emoticons;
        emoticons.splice(middleElementIndex, 1);
    } else {
        filteredEmoticons = emoticons;
    }
    return filteredEmoticons;
};
const getMessage = async (messageId) => {
    const message = await model.messages.findOne({
        where: {
            id: messageId,
        },
        attributes: ['id', 'text'],
        raw: true,
    });
    return message;
};
exports.getAllSettings = async (req, res) => {
    model.settings.findAll({
            include: [{
                    model: model.messages,
                    as: 'message',
                    attributes: ['id', 'text', 'language'],
                },
                {
                    model: model.emoticonsGroups,
                    attributes: ['id', 'name'],
                }, {
                    model: model.users,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        })
        .then(
            settings => res.json({
                error: false,
                data: settings,
            }),
        )
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
};
exports.getLastSettings = async (req, res) => {
    model.settings.findOne({
            order: [
                ['createdAt', 'DESC'],
            ],
            include: [{
                    model: model.messages,
                    as: 'message',
                    attributes: ['id', 'text', 'language'],
                },
                {
                    model: model.emoticonsGroups,
                    as: 'emoticonsGroup',
                    attributes: ['name'],
                },
            ],
        })
        .then(async (settings) => {
            // eslint-disable-next-line max-len
            const filteredEmoticons = await getEmoticonsForSettings(settings.emoticonsGroupId, settings.emoticonNumber);
            res.json({
                error: false,
                data: settings,
                emoticons: filteredEmoticons,
            });
        })
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
};
exports.getOneSettings = async (req, res) => {
    const settingsId = req.params.id;

    model.settings.findOne({
            where: {
                id: settingsId,
            },
            include: [{
                    model: model.messages,
                    as: 'message',
                    attributes: ['id', 'text', 'language'],
                },
                {
                    model: model.emoticonsGroups,
                    attributes: ['id', 'name'],
                }, {
                    model: model.users,
                },
            ],
        })
        .then(async (settings) => {
            const emoticons = await model.emoticons.findAll({
                where: {
                    emoticonsGroupId: settings.emoticonsGroupId,
                },
                attributes: ['id', 'name', 'value', 'symbol'],
                raw: true,
            });
            let filteredEmoticons = [];
            if (settings.emoticonNumber === 3) {
                for (let i = 0; i < emoticons.length; i += 2) {
                    filteredEmoticons.push(emoticons[i]);
                }
            } else if (settings.emoticonNumber === 4) {
                const middleElementIndex = parseInt(emoticons.length / 2, 10);
                filteredEmoticons = emoticons;
                emoticons.splice(middleElementIndex, 1);
            } else {
                filteredEmoticons = emoticons;
            }
            res.json({
                error: false,
                data: settings,
                emoticons: filteredEmoticons,
            });
        })
        .catch(error => res.json({
            error: true,
            message: error,
        }));
};
exports.createSettings = async (req, res) => {
    const {
        emoticonNumber,
        messageId,
        messageTimeout,
        emoticonsGroupId,
        userId,
    } = req.body;
    const objekt = {};
    objekt.error = false;
    objekt.data = req.body;
    if (typeof (emoticonNumber) !== 'undefined') {
        if (emoticonNumber < 3 || emoticonNumber > 5) {
            res.status(400).json({
                error: true,
                message: 'Number of emoticons not in specified range!',
            });
            return;
        }
    }

    if (typeof (messageTimeout) !== 'undefined') {
        if (messageTimeout < 0 || messageTimeout > 10) {
            res.status(400).json({
                error: true,
                message: 'Message timeout should be in range 0-10 sec!',
            });
            return;
        }
    }

    model.settings.create({
            emoticonNumber,
            messageId,
            messageTimeout,
            emoticonsGroupId,
            userId,
        })
        .then(async (settings) => {
            objekt.emoticons = await getEmoticonsForSettings(emoticonsGroupId, emoticonNumber);
            // Send live info to client
            io.emit('newSettings', objekt);

            return res.json({
                error: false,
                data: settings,
                message: 'Settings have ben updated.',
            });
        })
        .catch(error => res.json({
            error: true,
            message: error,
        }));
};
exports.updateSettings = async (req, res) => {
    const settingsId = req.params.id;
    const {
        emoticonNumber,
        messageId,
        messageTimeout,
        emoticonsGroupId,
        userId,
    } = req.body;

    const objekt = {};
    objekt.error = false;
    objekt.data = req.body;


    if (emoticonNumber && !(isNaN(emoticonNumber))) {
        if (emoticonNumber < 3 || emoticonNumber > 5) {
            return res.status(400).json({
                error: true,
                message: 'Number of emoticons not in specified range!',
            });
        }
    } else {
        return res.status(400).json({
            error: true,
            message: 'Number of emoticons not set!',
        });
    }

    if (messageTimeout) {
        if (messageTimeout < 0 || messageTimeout > 10) {
            return res.status(400).json({
                error: true,
                message: 'Message timeout should be in range 0-10 sec!',
            });
        }
    }

    // if emoticonNumber not changed
    const old = await model.settings.findOne({
            where: {
                id: settingsId,
                emoticonNumber,
                emoticonsGroupId,
            },
            raw: true,
        })
        .then(setting => setting)
        .catch(error => res.json({
            error: true,
            message: error,
        }));

    // if emoticonNumber not changed => update, else => create new
    if (old !== null) {
        model.settings.update({
                emoticonNumber,
                messageId,
                messageTimeout,
                emoticonsGroupId,
                userId,
            }, {
                where: {
                    id: settingsId,
                },
            })
            .then(async (settings) => {
                objekt.emoticons = await getEmoticonsForSettings(emoticonsGroupId, emoticonNumber);
                objekt.data.message = await getMessage(messageId);
                // Send live info to client
                io.emit('newSettings', objekt);

                res.json({
                    error: false,
                    data: settings,
                    message: 'Settings have been updated.',
                });
            })
            .catch(error => res.json({
                error: true,
                message: error,
            }));
    } else {
        model.settings.create({
                emoticonNumber,
                messageId,
                messageTimeout,
                emoticonsGroupId,
                userId,
            })
            .then(async (settings) => {
                objekt.emoticons = await getEmoticonsForSettings(emoticonsGroupId, emoticonNumber);
                objekt.data.message = await getMessage(messageId);

                // Send live info to client
                io.emit('newSettings', objekt);

                res.status(201).json({
                    error: false,
                    data: settings,
                    message: 'Settings have been created.',
                });
            })
            .catch(error => res.json({
                error: true,
                message: error,
            }));
    }
};
exports.deleteSettings = async (req, res) => {
    const settings = req.params.id;

    model.settings.destroy({
            where: {
                id: settings,
            },
        })
        .then(resStatus => res.json({
            error: false,
            status: resStatus,
            message: 'Settings have been deleted.',
        }))
        .catch(error => res.json({
            error: true,
            message: error,
        }));
};
exports.testRouteSettings = async (req, res) => {
    const {
        emoticonNumber,
        emoticonsGroupId,
    } = req.body;

    model.settings.findAll({
            where: {
                emoticonsGroupId,
                emoticonNumber,
            },
            attributes: ['id', 'emoticonNumber', 'messageId', 'emoticonsGroupId', 'messageTimeout', 'userId'],
            raw: true,
        })
        .then(async (settings) => {
            res.json({
                error: false,
                data: settings,
            });
        })
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
};
