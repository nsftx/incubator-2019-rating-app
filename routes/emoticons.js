const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const emoticonsController = require('../controllers/emoticons');

// GET all emoticons
router.get('/', auth, emoticonsController.getAllEmoticons);

// Emoticons POST
router.post('/', auth, emoticonsController.createEmoticon);

// Emoticons UPDATE
router.put('/:id', auth, emoticonsController.updateEmoticon);

// get one
router.get('/:id', auth, emoticonsController.getOneEmoticon);

// delete
router.delete('/:id', auth, emoticonsController.deleteEmoticon);

module.exports = router;
