const express = require('express');

const router = express.Router();
const model = require('../models/index');
const auth = require('../middleware/auth');


router.get('/', auth, (req, res) => {
    model.messages.findAll({})
        .then(messages => res.json({
            error: false,
            data: messages,
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
});

router.post('/', auth, (req, res) => {
    const {
        text,
        language,
    } = req.body;


    if (text.length < 3 || text.length > 120) {
        res.json({
            error: true,
            message: 'Text must be between 3 and 120 characters!',
        });
    } else {
        model.messages.create({
                text,
                language,
            })
            .then(messages => res.status(201).json({
                error: false,
                data: messages,
                message: 'New message have been created.',
            }))
            .catch(error => res.json({
                error: true,
                message: error,
            }));
    }
});


// update settings to new message
router.post('/:settingId', auth, async (req, res) => {
    const {
        text,
        language,
    } = req.body;

    // eslint-disable-next-line prefer-destructuring
    const settingId = req.params.settingId;

    if (text.length < 3 || text.length > 120) {
        return res.json({
            error: true,
            message: 'Text must be between 3 and 120 characters!',
        });
    }
    model.messages.create({
            text,
            language,
        }).then((messages) => {
            model.settings.update({
                messageId: messages.dataValues.id,
            }, {
                where: {
                    id: settingId,
                },
            });
        })
        .then(messages => res.json({
            error: false,
            data: messages,
            message: 'Message has been created!',
        }))
        .catch(error => res.json({
            error: true,
            message: error,
        }));
});

router.put('/:id', auth, (req, res) => {
    const messageId = req.params.id;

    const {
        text,
        language,
    } = req.body;


    if (text.length < 3 || text.length > 120) {
        res.json({
            error: true,
            message: 'Text must be between 3 and 120 characters!',
        });
    } else {
        model.messages.update({
                text,
                language,
            }, {
                where: {
                    id: messageId,
                },
            })
            .then(messages => res.json({
                error: false,
                data: messages,
                message: 'Message has been updated!',
            }))
            .catch(error => res.json({
                error: true,
                message: error,
            }));
    }
});


router.get('/language/:lang', auth, (req, res) => {
    const lang = req.params;

    model.messages.findAll({
            where: {
                language: lang,
            },
        })
        .then(message => res.json({
            error: false,
            data: message,
        }))
        .catch(error => res.json({
            error: true,
            message: error,
        }));
});

router.get('/:id', auth, (req, res) => {
    const messageId = req.params.id;

    model.messages.findOne({
            where: {
                id: messageId,
            },
        })
        .then(message => res.json({
            error: false,
            data: message,
        }))
        .catch(error => res.json({
            error: true,
            message: error,
        }));
});

module.exports = router;
