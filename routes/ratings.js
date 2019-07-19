const express = require('express');
const sequelize = require('sequelize');

const router = express.Router();
const model = require('../models/index');

// eslint-disable-next-line prefer-destructuring
const Op = sequelize.Op;

/* GET all ratings. */
router.get('/', (req, res) => {
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
router.post('/range', async (req, res) => {
    const {
        date,
        interval,
    } = req.body;

    const settings = await model.settings.findOne({
            order: [
                ['createdAt', 'DESC'],
            ],
            raw: true,
        })
        .then(setting => setting)
        .catch(error => res.json({
            error: true,
            message: error,
        }));


    const emoticons = await model.emoticons.findAll({
        where: {
            emoticonsGroupId: settings.emoticonsGroupId,
        },
        attributes: ['id', 'name', 'value', 'symbol'],
        raw: true,
    });

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
        }));
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

router.post('/days', async (req, res) => {
    const {
        startDate,
        endDate,
    } = req.body;

    const settings = await model.settings.findOne({
        order: [
            ['createdAt', 'DESC'],
        ],
        raw: true,
    });

    const emoticons = await model.emoticons.findAll({
        where: {
            emoticonsGroupId: settings.emoticonsGroupId,
        },
        attributes: ['name', 'value', 'symbol'],
        raw: true,
    });

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
        }));

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


router.post('/report', async (req, res) => {
    const {
        startDate,
        endDate,
    } = req.body;

    const settings = await model.settings.findOne({
        order: [
            ['createdAt', 'DESC'],
        ],
        raw: true,
    });

    const emoticons = await model.emoticons.findAll({
        where: {
            emoticonsGroupId: settings.emoticonsGroupId,
        },
        attributes: ['name', 'value', 'symbol'],
        raw: true,
    });


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
                attributes: ['name', 'symbol', 'value'],
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
router.post('/count', (req, res) => {
    const {
        date,
        settingsId,
    } = req.body;


    model.ratings.findAll({
            where: {
                settingId: settingsId,
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
                attributes: ['name', 'symbol', 'value'],
            }],
            raw: true,
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
router.get('/:id', (req, res) => {
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
router.post('/many', async (req, res) => {
    const {
        ratingsArray,
    } = req.body;

    const settings = await model.settings.findOne({
        order: [
            ['createdAt', 'DESC'],
        ],
        raw: true,
    });

    const promises = [];

    ratingsArray.forEach((rating) => {
        promises.push(model.ratings.create({
            emoticonId: rating.emoticonId,
            time: Date(),
            settingId: settings.id,
        }));
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
router.post('/', async (req, res) => {
    const {
        emoticonId,
    } = req.body;

    const emoticon = await model.emoticons.findOne({
        where: {
            id: emoticonId,
        },
        raw: true,
    });

    const settings = await model.settings.findOne({
        order: [
            ['createdAt', 'DESC'],
        ],
        raw: true,
    });

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
            .catch(error => res.json({
                error: true,
                message: error,
            }));
    }
});

/* UPDATE rating */
router.put('/:id', (req, res) => {
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

/* router.get('/counts', (req, res) => {
    model.ratings.findAll({
        attributes: ['emoticonId', [sequelize.fn('count', sequelize.col('emoticonId')), 'count']],
            group: ['emoticonId'],
            raw: true,
        })
        .then(ratings => res.json({
            error: false,
            data: ratings,
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
}); */

/* router.get('/counts/:settingId', (req, res) => {
    const setting = req.params.settingId;
    model.ratings.findAll({
        attributes: ['emoticonId', [sequelize.fn('count', sequelize.col('emoticonId')), 'count']],
            where: {
                settingId: setting,
            },
            group: ['emoticonId'],
            raw: true,
        }).then(ratings => res.json({
            error: false,
            data: ratings,
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
}); */
