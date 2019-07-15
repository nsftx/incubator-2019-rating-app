const express = require('express');

const router = express.Router();
const model = require('../models/index');


router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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


router.get('/language/:lang', (req, res) => {
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

router.get('/:id', (req, res) => {
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
