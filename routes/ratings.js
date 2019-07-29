const express = require('express');
const sequelize = require('sequelize');

const router = express.Router();
const request = require('request-promise');
const moment = require('moment');
const model = require('../models/index');
const auth = require('../middleware/auth');

// eslint-disable-next-line prefer-destructuring
const Op = sequelize.Op;


const getCurrentSettings = () => {
    const settings = model.settings.findOne({
        order: [
            ['createdAt', 'DESC'],
        ],
        raw: true,
    });
    return settings;
};

const getEmoticons = async (groupId) => {
    const emoticons = await model.emoticons.findAll({
        where: {
            emoticonsGroupId: groupId,
        },
        attributes: ['id', 'name', 'value', 'symbol'],
        raw: true,
    });
    return emoticons;
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
    const hook = 'https://hooks.slack.com/services/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';
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
    const datum = new Date();
    const date = moment(String(datum)).format('YYYY-MM-DD');
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
    console.log(sum['emoticon.sum'], ratingsCount.count);
    console.log('Average rating:', averageRating);
    if (ratingsCount.count > 200 && averageRating < 3.5) {
        // to avoid spam in slack check every 50th rating in day
        if (ratingsCount.count % 50 === 0) {
            await slackPush(averageRating);
        }
    }
};

/* GET all ratings. */
router.get('/', auth, (req, res) => {
    model.ratings.findAll({
            include: [model.settings],
        }).then(ratings => res.json({
            error: false,
            data: ratings,
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
});

/* get count of ratings in specified intervals */
router.post('/range', auth, async (req, res) => {
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
                    /* [sequelize.fn('time', new Date(`${date}T${j}:00:00.000Z`)), 'start'],
                    [sequelize.fn('time', new Date(`${date}T${z}:00:00.000Z`)), 'end'], */
                    'emoticonId',
                    [sequelize.fn('count', sequelize.col('emoticonId')), 'count'],

                ],
                group: ['emoticonId'],
                raw: true,
            })
            .then(setting => setting)
            .catch(error => res.json({
                error: true,
                message: error,
            })));
    }

    const dataArray = [];

    Promise.all(promises).then((result) => {
        /* const filtered = result.filter(el => el.length > 0); */
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
                /* start: `${date} ${j}:00:00`, */
                time: `${date} ${z}:00:00`,
            };
            dataArray.push(data);
        }

        for (let i = 0; i < result.length; i += 1) {
            dataArray[i].ratings = result[i];
        }

        res.json({
            error: false,
            data: dataArray,
            emoticons,
        });
    });
});

router.post('/days', auth, async (req, res) => {
    const {
        startDate,
        endDate,
    } = req.body;

    const settings = await getCurrentSettings();
    const emoticons = await getEmoticonsForSettings(settings.emoticonsGroupId, settings.emoticonNumber);

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
            .catch(error => res.json({
                error: true,
                message: error,
            })));


        start.setDate(start.getDate() + 1);
    }

    const dataArray = [];

    Promise.all(promises).then((result) => {
        // const filtered = result.filter(el => el.length > 0);
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

        res.json({
            error: false,
            data: dataArray,
            emoticons,
        });
    });
});


router.post('/report', auth, async (req, res) => {
    const {
        startDate,
        endDate,
    } = req.body;

    const settings = await getCurrentSettings();
    const emoticons = await getEmoticons(settings.emoticonsGroupId);


    model.ratings.findAll({
            where: {
                settingId: settings.id,
                time: {
                    [Op.gte]: new Date(`${startDate}T00:00:00.000Z`),
                    [Op.lte]: new Date(`${endDate}T23:59:59.999Z`),
                },
            },
            include: [{
                model: model.emoticons,
                attributes: ['id', 'name', 'symbol', 'value'],
            }],
            attributes: [
                'emoticonId',
                [sequelize.fn('count', sequelize.col('emoticonId')), 'count'],
            ],
            group: ['emoticonId'],
        })
        .then(count => res.json({
            error: false,
            data: count,
            emoticons,
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
});


/* get count of ratings in one day */
router.post('/count', auth, async (req, res) => {
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
            include: [{
                model: model.emoticons,
                attributes: ['id', 'name', 'symbol', 'value'],
            }],
        })
        .then(count => res.json({
            error: false,
            data: count,
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
});


/* GET one rating */
router.get('/:id', auth, (req, res) => {
    const ratingId = req.params.id;

    model.ratings.findOne({
            where: {
                id: ratingId,
            },
        })
        .then(rating => res.json({
            error: false,
            data: rating,
        }))
        .catch(error => res.json({
            error: true,
            message: error,
        }));
});

/* CREATE bulk of ratings */
router.post('/many', auth, async (req, res) => {
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
            }).then(ratings => ratings)
            .catch(error => res.json({
                error: true,
                message: error,
            })));
    });

    Promise.all(promises).then((result) => {
        /* const filtered = result.filter(el => el.length > 0); */
        res.json({
            error: false,
            data: result,
            message: 'Ratings have been created',
        });
    });
});

/* ADD new rating */
router.post('/', auth, async (req, res) => {
    const {
        emoticonId,
    } = req.body;

    const emoticon = await model.emoticons.findOne({
        where: {
            id: emoticonId,
        },
        raw: true,
    });

    const settings = await getCurrentSettings();

    if (emoticon.emoticonsGroupId !== settings.emoticonsGroupId) {
        res.json({
            error: true,
            message: 'Emoticon not valid!',
        });
    } else {
        model.ratings.create({
                emoticonId: emoticon.id,
                time: Date(),
                settingId: settings.id,
            })
            .then(ratings => res.status(201).json({
                error: false,
                data: ratings,
                message: 'New reaction have been added.',
            }))
            .then(() => {
                checkRatingsStatus(settings);
            })
            .catch(error => res.json({
                error: true,
                message: error,
            }));
    }
});

/* UPDATE rating */
router.put('/:id', auth, (req, res) => {
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
        .then(rating => res.json({
            error: false,
            message: 'Rating has been updated.',
            data: rating,
        }))
        .catch(error => res.json({
            error: true,
            message: error,
        }));
});


module.exports = router;
