/* eslint-disable max-len */
const sequelize = require('sequelize');
const request = require('request');
const moment = require('moment');
const io = require('../server');
const model = require('../models/index');


// eslint-disable-next-line prefer-destructuring
const Op = sequelize.Op;

const classic = (error, data, message = '') => {
    const res = {
        error,
        data,
        message,
    };
    return res;
};
const withEmoticons = (error, data, emoticons) => {
    const res = {
        error,
        data,
        emoticons,
    };
    return res;
};


const getCurrentSettings = () => {
    const settings = model.settings.findOne({
        order: [
            ['createdAt', 'DESC'],
        ],
        raw: true,
    });
    return settings;
};

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
const slackPush = (averageRating) => {
    const hook = process.env.SLACK_HOOK;
    const avg = averageRating.toFixed(2);
    (async () => {
        try {
            // post to slack
            const slackBody = {
                text: `Ratings too low! \nAverage rating = ${avg}`,
            };

            await request({
                url: hook,
                method: 'POST',
                body: slackBody,
                json: true,
            });
        } catch (error) {
            console.log('error', error);
        }
    })();
};
const checkRatingsStatus = async (settings) => {
    const date = moment().format('YYYY-MM-DD');
    const ratingsCount = await model.ratings.findOne({
        where: {
            settingId: settings.id,
            time: {
                [Op.startsWith]: date,
            },
        },
        attributes: [
            [sequelize.fn('count', sequelize.col('id')), 'count'],
        ],
        raw: true,

    });
    const sum = await model.ratings.findOne({
        where: {
            settingId: settings.id,
            time: {
                [Op.startsWith]: date,
            },
        },
        include: [{
            model: model.emoticons,
            attributes: [
                [sequelize.fn('sum', sequelize.col('value')), 'sum'],
            ],
            required: true,
        }],
        attributes: [],
        raw: true,
    });
    const averageRating = sum['emoticon.sum'] / ratingsCount.count;
    if (ratingsCount.count > 200 && averageRating < 3.5) {
        // to avoid spam in slack check every 50th rating in day
        if (ratingsCount.count % 50 === 0) {
            await slackPush(averageRating);
        }
    }
};

exports.getAllRatings = (req, res) => {
    model.ratings.findAll()
        .then(ratings => res.json(classic(false, ratings)))
        .catch(() => res.json(classic(true, [], 'Server error')));
};
exports.getRatingsByHour = async (req, res) => {
    const {
        date,
        interval,
    } = req.body;

    const settings = await getCurrentSettings();
    const emoticons = await getEmoticonsForSettings(settings.emoticonsGroupId, settings.emoticonNumber);

    const promises = [];

    for (let i = 0; i < 24; i += interval) {
        let z = String(i + interval);
        let j = String(i);

        if (i < 10) {
            j = `0${j}`;
        }
        if (i + interval < 10) {
            z = `0${z}`;
        }

        promises.push(model.ratings.findAll({
                where: {
                    settingId: settings.id,
                    time: {
                        [Op.gte]: new Date(`${date}T${j}:00:00.000Z`),
                        [Op.lt]: new Date(`${date}T${z}:00:00.000Z`),
                    },
                },
                attributes: [
                    'emoticonId',
                    [sequelize.fn('count', sequelize.col('emoticonId')), 'count'],

                ],
                group: ['emoticonId'],
                raw: true,
            })
            .then(setting => setting)
            .catch(() => res.json(classic(true, [], 'Server error'))));
    }

    const dataArray = [];

    Promise.all(promises).then((result) => {
        for (let i = 0; i < 24; i += interval) {
            let z = String(i + interval);
            let j = String(i);

            if (i < 10) {
                j = `0${j}`;
            }
            if (i + interval < 10) {
                z = `0${z}`;
            }

            const data = {
                time: `${date} ${z}:00:00`,
            };
            dataArray.push(data);
        }

        for (let i = 0; i < result.length; i += 1) {
            dataArray[i].ratings = result[i];
        }

        return res.json(withEmoticons(false, dataArray, emoticons));
    });
};
exports.getRatingsByDays = async (req, res) => {
    const {
        startDate,
        endDate,
    } = req.body;

    const settings = await getCurrentSettings();
    const emoticons = await getEmoticonsForSettings(settings.emoticonsGroupId,
        settings.emoticonNumber);
    let start = new Date(startDate);
    const end = new Date(endDate);


    const promises = [];

    while (start <= end) {
        let month = start.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = start.getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        const date = `${start.getFullYear()}-${month}-${day}`;
        promises.push(model.ratings.findAll({
                where: {
                    settingId: settings.id,
                    time: {
                        [Op.startsWith]: date,
                    },
                },
                attributes: [
                    'emoticonId',
                    [sequelize.fn('count', sequelize.col('emoticonId')), 'count'],
                ],
                group: ['emoticonId'],

                raw: true,
            })
            .then(ratings => ratings)
            .catch(() => res.json(classic(true, [], 'Server error'))));


        start.setDate(start.getDate() + 1);
    }

    const dataArray = [];

    Promise.all(promises).then((result) => {
        start = new Date(startDate);
        while (start <= end) {
            let month = start.getMonth() + 1;
            if (month < 10) {
                month = `0${month}`;
            }
            let day = start.getDate();
            if (day < 10) {
                day = `0${day}`;
            }
            const date = `${start.getFullYear()}-${month}-${day}`;

            const data = {
                time: date,
            };
            dataArray.push(data);

            start.setDate(start.getDate() + 1);
        }
        for (let i = 0; i < result.length; i += 1) {
            dataArray[i].ratings = result[i];
        }

        return res.json(withEmoticons(false, dataArray, emoticons));
    });
};
exports.getCountOfRatings = async (req, res) => {
    const {
        startDate,
        endDate,
    } = req.body;

    const settings = await getCurrentSettings();
    const emoticons = await getEmoticonsForSettings(settings.emoticonsGroupId,
        settings.emoticonNumber);


    model.ratings.findAll({
            where: {
                settingId: settings.id,
                time: {
                    [Op.gte]: new Date(`${startDate}T00:00:00.000Z`),
                    [Op.lte]: new Date(`${endDate}T23:59:59.999Z`),
                },
            },
            attributes: [
                'emoticonId',
                [sequelize.fn('count', sequelize.col('emoticonId')), 'count'],
            ],
            group: ['emoticonId'],
            raw: true,
        })
        .then((ratings) => {
            const newEmoticons = [];
            for (let i = 0; i < emoticons.length; i += 1) {
                emoticons[i].count = 0;
                for (let j = 0; j < ratings.length; j += 1) {
                    if (emoticons[i].id === ratings[j].emoticonId) {
                        emoticons[i].count = ratings[j].count;
                    }
                }
                newEmoticons.push(emoticons[i]);
            }
            return res.json(classic(false, newEmoticons));
        })
        .catch(() => res.json(classic(true, [], 'Server error')));
};
exports.getCountOfRatingsDay = async (req, res) => {
    const {
        date,
    } = req.body;


    const settings = await getCurrentSettings();

    model.ratings.findAll({
            where: {
                settingId: settings.id,
                time: {
                    [Op.startsWith]: date,
                },
            },
            attributes: [
                'emoticonId',
                [sequelize.fn('count', sequelize.col('emoticonId')), 'count'],
            ],
            group: ['emoticonId'],
            raw: true,
        })
        .then(async (ratings) => {
            const emoticons = await getEmoticonsForSettings(settings.emoticonsGroupId,
                settings.emoticonNumber);
            const newEmoticons = [];
            for (let i = 0; i < emoticons.length; i += 1) {
                emoticons[i].count = 0;
                for (let j = 0; j < ratings.length; j += 1) {
                    if (emoticons[i].id === ratings[j].emoticonId) {
                        emoticons[i].count = ratings[j].count;
                    }
                }
                newEmoticons.push(emoticons[i]);
            }

            return res.json(classic(false, newEmoticons));
        })
        .catch(() => res.json(classic(true, [], 'Server error')));
};
exports.getOneRating = (req, res) => {
    const ratingId = req.params.id;

    model.ratings.findOne({
            where: {
                id: ratingId,
            },
        })
        .then(rating => res.json(classic(false, rating)))
        .catch(() => res.json(classic(true, {}, 'Server error')));
};
exports.createManyRatings = async (req, res) => {
    const {
        ratingsArray,
    } = req.body;

    const settings = await getCurrentSettings();

    const promises = [];

    ratingsArray.forEach((rating) => {
        promises.push(model.ratings.create({
                emoticonId: rating.emoticonId,
                time: Date(),
                settingId: settings.id,
            })
            .then(ratings => ratings)
            .catch(() => res.json(classic(true, {}, 'Server error'))));
    });

    Promise.all(promises).then((result) => {
        res.json(classic(false, result, 'Ratings have been created'));
    });
};
exports.createRating = async (req, res) => {
    const {
        emoticonId,
    } = req.body;
    if (!emoticonId) {
        return res.status(400).json(classic(true, {}, 'emoticonId not defined'));
    }

    const emoticon = await model.emoticons.findOne({
        where: {
            id: emoticonId,
        },
        raw: true,
    });

    const settings = await getCurrentSettings();

    if (emoticon.emoticonsGroupId !== settings.emoticonsGroupId) {
        return res.status(400).json(classic(true, {}, 'Emoticon not valid!'));
    }
    return model.ratings.create({
            emoticonId: emoticon.id,
            time: Date(),
            settingId: settings.id,
        })
        .then((ratings) => {
            const data = ratings.dataValues;
            data.type = 'ratings';
            data.time = moment.utc(ratings.dataValues.time).format('YYYY-MM-DD HH:mm:ss');
            io.emit('newRating', ratings);
            res.status(201).json(classic(false, ratings, 'New reaction has been added.'));
        })
        .then(() => {
            checkRatingsStatus(settings);
        })
        .catch((e) => {
            console.log(e);
            return res.json(classic(true, {}, 'Server error'));
        });
};
exports.updateRating = (req, res) => {
    const ratingId = req.params.id;

    const {
        emoticon,
    } = req.body;

    model.ratings.update({
            emoticonId: emoticon,
        }, {
            where: {
                id: ratingId,
            },
        })
        .then(rating => res.json(classic(false, rating, 'Rating has been updated')))
        .catch(() => res.json(classic(true, {}, 'Server error')));
};
exports.deleteRating = (req, res) => {
    const ratingId = req.params.id;

    model.ratings.destroy({
            where: {
                id: ratingId,
            },
        })
        .then(rating => res.json(classic(false, rating, 'Rating has been deleted.')))
        .catch(() => res.json(classic(true, {}, 'Server error')));
};
