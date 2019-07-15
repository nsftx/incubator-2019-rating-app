const express = require('express');

const router = express.Router();

const model = require('../models/index');

// get all
router.get('/', (req, res) => {
  model.emoticonsGroups.findAll().then(emoticonsGroups => res.json({
      error: false,
      data: emoticonsGroups,
    }))
    .catch(error => res.json({
      error: true,
      data: [],
      message: error,
    }));
});


// post
router.post('/', (req, res) => {
  const {
    name,
  } = req.body;
  model.emoticonsGroups.create({
      name,

    })
    .then(emoticonsGroups => res.status(201).json({
      error: false,
      data: emoticonsGroups,
      message: 'New emoticon has been created.',
    }))
    .catch(error => res.json({
      error: true,
      data: [],
      message: error,
    }));
});
// put
router.put('/:id', (req, res) => {
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
      message: 'emoticonsGroup has been updated.',
    }))
    .catch(error => res.json({
      error: true,
      message: error,
    }));
});
// get one

router.get('/:id', (req, res) => {
  const emoticonsGroupId = req.params.id;

  model.emoticonsGroups.findOne({
      where: {
        id: emoticonsGroupId,
      },
    })
    .then(emoticonsGroups => res.json({
      error: false,
      data: emoticonsGroups,
    }))
    .catch(error => res.json({
      error: true,
      message: error,
    }));
});
// delete
router.delete('/:id', (req, res) => {
  const emoticonsGroupId = req.params.id;

  model.emoticonsGroups.destroy({
      where: {
        id: emoticonsGroupId,
      },
    })
    .then(status => res.json({
      error: false,
      data: status,
      message: 'emoticonsGroup has been delete.',
    }))
    .catch(error => res.json({
      error: true,
      message: error,
    }));
});


module.exports = router;
