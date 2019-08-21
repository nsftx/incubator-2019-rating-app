const model = require('../models/index');
const response = require('../helpers/responses');

exports.getAllGroups = async (req, res) => {
    model.emoticonsGroups.findAll({
            include: [model.emoticons],
            order: [
                ['id', 'DESC'],
            ],
            limit: 4,
        })
        .then(emoticonsGroups => res.json(response.classic(false, emoticonsGroups)))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
exports.getOne = async (req, res) => {
    const EmoticonsGroupsId = req.params.id;

    model.settings.findOne({
            where: {
                id: EmoticonsGroupsId,
            },
        })
        .then(emoticonsGroup => res.json(response.classic(false, emoticonsGroup)))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
exports.createGroup = async (req, res) => {
    const {
        name,
    } = req.body;

    if (!name) {
        return res.status(400).json(response.classic(true, {}, 'Name not defined!'));
    }
    model.emoticonsGroups.create({
            name,
        })
        .then(emoticonsGroups => res.status(201).json(response.classic(false, emoticonsGroups, 'New emoticon group has been created.')))
        .catch(() => res.json(response.classic(true, [], 'Server error')));
};
exports.createMany = async (req, res) => {
    const {
        name,
        emoticonsArray,
    } = req.body;

    if (!name) {
        return res.status(400).json(response.classic(true, {}, 'Name not defined!'));
    }
    if (!emoticonsArray) {
        return res.status(400).json(response.classic(true, {}, 'emoticonsArray not defined'));
    }
    await model.emoticonsGroups.create({
            name,
        })
        .then((group) => {
            if (typeof (emoticonsArray) !== 'undefined') {
                if (emoticonsArray.length < 3 || emoticonsArray.length > 5) {
                    return res.status(400).json(response.classic(true, {}, 'Emoticons group should have 3-5 emoticons'));
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
                return res.status(201).json(response.classic(false, result, 'New emoticon group has been created.'));
            });
        })
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
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
        return res.status(400).json(response.classic(true, {}, 'Emoticon group does not exist'));
    }

    model.emoticonsGroups.update({
            name,
        }, {
            where: {
                id: emoticonsGroupID,
            },
        })
        .then(emoticonsGroups => res.json(response.classic(false, emoticonsGroups, 'Emoticons group has been updated.')))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
exports.deleteGroup = async (req, res) => {
    const emoticonsGroupId = req.params.id;

    model.emoticonsGroups.destroy({
            where: {
                id: emoticonsGroupId,
            },
        })
        .then(emoticonsGroups => res.json(response.classic(false, emoticonsGroups, 'Emoticons group has been deleted.')))
        .catch(() => res.json(response.classic(true, {}, 'Server error')));
};
