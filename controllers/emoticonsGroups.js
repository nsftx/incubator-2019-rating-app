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
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
};
exports.createGroup = async (req, res) => {
    const {
        name,
    } = req.body;
    model.emoticonsGroups.create({
            name,

        })

        .then(emoticonsGroups => res.status(201).json({
            error: false,
            data: emoticonsGroups,
            message: 'New emoticon group has been created.',
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
};
exports.createMany = async (req, res) => {
    const {
        name,
        emoticonsArray,
    } = req.body;
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
        }).catch(error => res.json({
            error: true,
            message: error,
        }));
};
exports.updateGroup = async (req, res) => {
    const emoticonsGroupID = req.params.id;
    const {
        name,
    } = req.body;

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
        .catch(error => res.json({
            error: true,
            message: error,
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
        .catch(error => res.json({
            error: true,
            message: error,
        }));
};
