const model = require('../models/index');
const io = require('../server');

const response = require('../helpers/responses');

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
            settings => res.json(response.classic(false, settings)),
        )
        .catch(() => res.json(response.classic(true, [], 'Server error')));
};
exports.getLastSettings = (req, res) => {
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
            const filteredEmoticons = await getEmoticonsForSettings(settings.emoticonsGroupId,
                settings.emoticonNumber);
            res.json(response.withEmoticons(false, settings, filteredEmoticons));
        })
        .catch(() => res.json(response.classic(true, [], 'Server error')));
};
exports.getOneSettings = (req, res) => {
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
            res.json(response.withEmoticons(false, settings, filteredEmoticons));
        })
        .catch(() => res.json(response.classic(true, [], 'Server error')));
};
exports.createSettings = (req, res) => {
    const {
        emoticonNumber,
        messageId,
        messageTimeout,
        emoticonsGroupId,
        userId,
    } = req.body;

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
    const socketData = {};
    socketData.type = 'settings';
    socketData.error = false;
    socketData.data = req.body;

    model.settings.create({
            emoticonNumber,
            messageId,
            messageTimeout,
            emoticonsGroupId,
            userId,
        })
        .then(async (settings) => {
            socketData.emoticons = await getEmoticonsForSettings(emoticonsGroupId, emoticonNumber);
            // Send live info to client
            io.emit('newSettings', socketData);

            return res.status(201).json(response.classic(false, settings, 'Settings have been created'));
        })
        .catch(() => res.json(response.classic(true, [], 'Server error')));
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

    if (!emoticonNumber) {
        return res.status(400).json(response.classic(true, {}, 'emoticonNumber not defined!'));
    }
    if (!messageId) {
        return res.status(400).json(response.classic(true, {}, 'messageId not defined!'));
    }
    if (!emoticonsGroupId) {
        return res.status(400).json(response.classic(true, {}, 'emoticonsGroupId not defined!'));
    }
    if (!userId) {
        return res.status(400).json(response.classic(true, {}, 'userId not defined!'));
    }


    if (!(Number.isNaN(emoticonNumber))) {
        if (emoticonNumber < 3 || emoticonNumber > 5) {
            return res.status(400).json(response.classic(true, {}, 'Number of emoticons not in specified range'));
        }
    } else {
        return res.status(400).json(response.classic(true, {}, 'Number of emoticons not set'));
    }

    if (messageTimeout) {
        if (messageTimeout < 0 || messageTimeout > 10) {
            return res.status(400).json(response.classic(true, {}, 'Message timeout should be in range 0-10 sec'));
        }
    }

    const socketData = {};
    socketData.type = 'settings';
    socketData.error = false;
    socketData.data = req.body;


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
        .catch(() => res.json(response.classic(true, [], 'Server error')));

    // if emoticonNumber not changed => update, else => create new
    if (old !== null) {
        return model.settings.update({
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
                socketData.emoticons = await getEmoticonsForSettings(emoticonsGroupId,
                    emoticonNumber);
                socketData.data.message = await getMessage(messageId);
                // Send live info to client
                io.emit('newSettings', socketData);

                return res.json(response.classic(false, settings, 'Settings have been updated'));
            })
            .catch(() => res.json(response.classic(true, [], 'Server error on update')));
    }
    return model.settings.create({
            emoticonNumber,
            messageId,
            messageTimeout,
            emoticonsGroupId,
            userId,
        })
        .then(async (settings) => {
            socketData.emoticons = await getEmoticonsForSettings(emoticonsGroupId,
                emoticonNumber);
            socketData.data.message = await getMessage(messageId);

            // Send live info to client
            io.emit('newSettings', socketData);

            return res.status(201).json(response.classic(false, settings, 'Settings have been created'));
        })
        .catch(() => res.status(400).json(response.classic(true, [], 'Server error on create')));
};
exports.deleteSettings = (req, res) => {
    const settings = req.params.id;

    model.settings.destroy({
            where: {
                id: settings,
            },
        })
        .then(setting => res.json(response.classic(false, setting, 'Settings have been deleted')))
        .catch(() => res.json(response.classic(true, [], 'Server error')));
};
