const express = require('express');

const router = express.Router();

const model = require('../models/index');
const auth = require('../middleware/auth');


// get all
router.get('/', auth, (req, res) => {
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
});


// post
router.post('/', auth, (req, res) => {
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

//  array post
router.post('/many', auth, async (req, res) => {
  const {
    name,
    emoticonsArray,
  } = req.body;
  await model.emoticonsGroups.create({
    name,
  }).then((group) => {
    if (typeof (emoticonsArray) !== 'undefined') {
      if (emoticonsArray.length < 3 || emoticonsArray.length > 5) {
        res.json({
          error: true,
          message: 'Emoticons should be in range 3-5 sec!',
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
});


// put
router.put('/:id', auth, (req, res) => {
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

router.get('/:id', auth, (req, res) => {
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
router.delete('/:id', auth, (req, res) => {
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
