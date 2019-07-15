
const express = require('express');

const router = express.Router();
const model = require('../models/index');
// var sequelize = require('sequelize')

router.get('/', (req, res) => {
    model.emoticons.findAll().then(emoticons => res.json({
            error: false,
            data: emoticons,
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            message: error,
        }));
});


// Emoticons POST
router.post('/', (req, res) => {
  const {
    name,
    symbol,
    emoticonsGroupId,
  } = req.body;
  model.emoticons.create({
    name,
    symbol,
    emoticonsGroupId,
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
});

// Emoticons UPDATE

router.put('/:id', (req, res) => {
  const { id } = req.params;

  const {
    name,
    symbol,
    emoticonsGroupId,
  } = req.body;

  model.emoticons.update({
    name,
    symbol,
    emoticonsGroupId,
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
});

// get one
router.get('/:id', (req, res) => {
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
});


// delete
router.delete('/:id', (req, res) => {
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
});

module.exports = router;
