const model = require('../models/index');
const response = require('../helpers/responses');


exports.getAllMessages = (req, res) => {
    model.messages.findAll({})
        .then(messages => res.json(response.classic(false, messages)))
        .catch(() => res.json(
            response.classic(true, [], 'Server error'),
        ));
};
exports.createMessage = (req, res) => {
    const {
        text,
        language,
    } = req.body;

    if (!text) {
        return res.status(400).json(response.classic(true, {}, 'Text not defined!'));
    }

    if (text.length < 3 || text.length > 120) {
        return res.status(400).json(response.classic(true, {}, 'Text must be between 3 and 120 characters!'));
    }
    return model.messages.create({
            text,
            language,
        })
        .then(messages => res.status(201).json(
            response.classic(false, messages, 'New message has been created.'),
        ))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
exports.createMessageForSettings = (req, res) => {
    const {
        text,
        language,
    } = req.body;

    // eslint-disable-next-line prefer-destructuring
    const settingId = req.params.settingId;
    if (!text) {
        return res.status(400).json(response.classic(true, {}, 'Text not defined!'));
    }

    if (text.length < 3 || text.length > 120) {
        return res.status(400).json(response.classic(true, {}, 'Text must be between 3 and 120 characters!'));
    }
    return model.messages.create({
            text,
            language,
        })
        .then((messages) => {
            model.settings.update({
                messageId: messages.dataValues.id,
            }, {
                where: {
                    id: settingId,
                },
            });
        })
        .then(messages => res.json(response.classic(false, messages, 'Message has been created!')))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
exports.updateMessage = (req, res) => {
    const messageId = req.params.id;
    const {
        text,
        language,
    } = req.body;

    if (text.length < 3 || text.length > 120) {
        return res.status(400).json(response.classic(true, {}, 'Text must be between 3 and 120 characters!'));
    }
    model.messages.update({
            text,
            language,
        }, {
            where: {
                id: messageId,
            },
        })
        .then(messages => res.json(response.classic(false, messages, 'Message has been updated!')))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
    return 1;
};
exports.getMessageByLanguage = (req, res) => {
    const lang = req.params;

    model.messages.findAll({
            where: {
                language: lang,
            },
        })
        .then(message => res.json(response.classic(false, message)))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
exports.getOneMessage = (req, res) => {
    const messageId = req.params.id;

    model.messages.findOne({
            where: {
                id: messageId,
            },
        })
        .then(message => res.json(response.classic(false, message)))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
exports.deleteMessage = (req, res) => {
    const messageId = req.params.id;

    model.messages.destroy({
            where: {
                id: messageId,
            },
        })
        .then(message => res.json(response.classic(false, message, 'Message has been deleted.')))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
