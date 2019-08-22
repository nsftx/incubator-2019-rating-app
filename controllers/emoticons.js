/* eslint-disable consistent-return */
const model = require('../models/index');
const response = require('../helpers/responses');

exports.getAllEmoticons = (req, res) => {
    model.emoticons.findAll().then(emoticons => res.json({
            error: false,
            data: emoticons,
        }))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
exports.createEmoticon = async (req, res) => {
    const {
        name,
        symbol,
        emoticonsGroupId,
        value,
    } = req.body;

    if (!name) {
        return res.status(400).json(response.classic(true, {}, 'Name not defined'));
    }
    if (!symbol) {
        return res.status(400).json(response.classic(true, {}, 'Symbol not defined'));
    }
    if (!emoticonsGroupId) {
        return res.status(400).json(response.classic(true, {}, 'emoticonsGroupId not defined'));
    }
    if (!value) {
        return res.status(400).json(response.classic(true, {}, 'Value not defined'));
    }

    await model.emoticons.findAll({
        where: {
            emoticonsGroupId,
        },
        raw: true,
    }).then((emoticons) => {
        if (emoticons && emoticons.length >= 5) {
            return res.json(response.classic(true, {}, 'Emoticons group already has 5 emoticons!'));
        }
        return emoticons;
    });


    model.emoticons.create({
            name,
            symbol,
            emoticonsGroupId,
            value,
        })
        .then(emoticon => res.status(201).json(response.classic(false, emoticon, 'Emoticon has been updated.')))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
exports.updateEmoticon = async (req, res) => {
    const {
        id,
    } = req.params;

    const {
        name,
        symbol,
        emoticonsGroupId,
        value,
    } = req.body;

    const emoticonExist = await model.emoticons.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!emoticonExist) {
        return res.status(400).json(response.classic(true, {}, 'Emoticon does not exist'));
    }
    model.emoticons.update({
            name,
            symbol,
            emoticonsGroupId,
            value,
        }, {
            where: {
                id,
            },
        })
        .then(emoticon => res.json(response.classic(false, emoticon, 'Emoticon has been updated.')))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};

exports.getOneEmoticon = (req, res) => {
    const EmoticonsId = req.params.id;

    model.settings.findOne({
            where: {
                id: EmoticonsId,
            },
            include: [{
                model: model.emoticonsGroups,
            }],
        })
        .then(emoticons => res.json(response.classic(false, emoticons)))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
exports.deleteEmoticon = (req, res) => {
    const EmoticonsId = req.params.id;

    model.emoticons.destroy({
            where: {
                id: EmoticonsId,
            },
        })
        .then(emoticon => res.json(response.classic(false, emoticon, 'Emoticon has been deleted.')))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
