const model = require('../models/index');

exports.getAllGroups = async (req, res) => {
    model.emoticonsGroups.findAll({
        include: [model.emoticons],
        order: [
            ['id', 'DESC'],
        ],
        limit: 4,
    })
        .then(emoticonsGroups => res.json({
            error: false,
            data: emoticonsGroups,
        }))
        .catch(() => res.json({
            error: true,
            data: [],
            message: 'Server error',
        }));
};
exports.getOne = async (req, res) => {
    const EmoticonsGroupsId = req.params.id;

    model.settings.findOne({
        where: {
            id: EmoticonsGroupsId,
        },
    })
        .then(emoticonsGroup => res.json({
            error: false,
            data: emoticonsGroup,
        }))
        .catch(() => res.json({
            error: true,
            message: 'Server error',
        }));
};
exports.createGroup = async (req, res) => {
    const {
        name,
    } = req.body;

    if (!name) {
        return res.status(400).json({
            error: true,
            data: {},
            message: 'Name not defined',
        });
    }
    model.emoticonsGroups.create({
        name,
    })
        .then(emoticonsGroups => res.status(201).json({
            error: false,
            data: emoticonsGroups,
            message: 'New emoticon group has been created.',
        }))
        .catch(() => res.json({
            error: true,
            data: [],
            message: 'Server error',
        }));
};
exports.createMany = async (req, res) => {
    const {
        name,
        emoticonsArray,
    } = req.body;

    if (!name) {
        return res.json({
            error: true,
            data: {},
            message: 'Name not defined',
        });
    }
    if (!emoticonsArray) {
        return res.json({
            error: true,
            data: {},
            message: 'emoticonsArray not defined',
        });
    }
    await model.emoticonsGroups.create({
        name,
    })
        .then((group) => {
            if (typeof (emoticonsArray) !== 'undefined') {
                if (emoticonsArray.length < 3 || emoticonsArray.length > 5) {
                    res.status(400).json({
                        error: true,
                        message: 'Emoticons group should have 3-5 emoticons',
                    });
                    return;
                }
            }
            const promises = [];
            emoticonsArray.forEach((emoticon) => {
                promises.push(model.emoticons.create({
                    name: emoticon.name,
                    value: emoticon.value,
                    symbol: emoticon.symbol,
                    emoticonsGroupId: group.dataValues.id,
                }));
            });

            Promise.all(promises).then((result) => {
                /* const filtered = result.filter(el => el.length > 0); */
                res.json({
                    error: false,
                    data: result,
                    message: 'Emoticons have been created',
                });
            });
        }).catch(() => res.json({
            error: true,
            message: 'Server error',
        }));
};
exports.updateGroup = async (req, res) => {
    const emoticonsGroupID = req.params.id;
    const {
        name,
    } = req.body;

    const groupExist = await model.emoticonsGroups.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!groupExist) {
        return res.status(400).json({
            error: true,
            data: {},
            message: 'No emoticonsGroup with that Id',
        });
    }

    model.emoticonsGroups.update({
        name,
    }, {
            where: {
                id: emoticonsGroupID,
            },
        })
        .then(emoticonsGroups => res.json({
            error: false,
            data: emoticonsGroups,
            message: 'Emoticons group has been updated.',
        }))
        .catch(() => res.json({
            error: true,
            message: 'Server error',
        }));
};
exports.deleteGroup = async (req, res) => {
    const emoticonsGroupId = req.params.id;

    model.emoticonsGroups.destroy({
        where: {
            id: emoticonsGroupId,
        },
    })
        .then(status => res.json({
            error: false,
            data: status,
            message: 'Emoticons group has been deleted.',
        }))
        .catch(() => res.json({
            error: true,
            message: 'Server error',
        }));
};
