const model = require('../models/index');

exports.getAllEmoticons = async (req, res) => {
    model.emoticons.findAll().then(emoticons => res.json({
        error: false,
        data: emoticons,
    }))
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
};
exports.createEmoticon = async (req, res) => {
    const {
        name,
        symbol,
        emoticonsGroupId,
        value,
    } = req.body;

    if (!name) {
        return res.json({
            error: true,
            data: {},
            message: 'Name not defined',
        });
    }
    if (!symbol) {
        return res.json({
            error: true,
            data: {},
            message: 'Symbol not defined',
        });
    }
    if (!emoticonsGroupId) {
        return res.json({
            error: true,
            data: {},
            message: 'emoticonsGroupId not defined',
        });
    }
    if (!value) {
        return res.json({
            error: true,
            data: {},
            message: 'Value not defined',
        });
    }
    model.emoticons.create({
        name,
        symbol,
        emoticonsGroupId,
        value,
    })
        .then(emoticons => res.status(201).json({
            error: false,
            data: emoticons,
            message: 'New emoticon has been created.',
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
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
        return res.json({
            error: true,
            data: {},
            message: 'No emoticons with that Id',
        });
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
        .then(emoticons => res.json({
            error: false,
            data: emoticons,
            message: 'Emoticon has been updated.',
        }))
        .catch(error => res.json({
            error: true,
            message: error,
        }));
};

exports.getOneEmoticon = async (req, res) => {
    const EmoticonsId = req.params.id;

    model.settings.findOne({
        where: {
            id: EmoticonsId,
        },
        include: [{
            model: model.emoticonsGroups,


        }],
    })
        .then(emoticons => res.json({
            error: false,
            data: emoticons,
        }))
        .catch(error => res.json({
            error: true,
            message: error,
        }));
};
exports.deleteEmoticon = async (req, res) => {
    const EmoticonsId = req.params.id;

    model.emoticons.destroy({
        where: {
            id: EmoticonsId,
        },
    })
        .then(status => res.json({
            error: false,
            data: status,
            message: 'Emoticon has been deleted.',
        }))
        .catch(error => res.json({
            error: true,
            message: error,
        }));
};
