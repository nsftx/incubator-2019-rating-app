const express = require('express');

const router = express.Router();
const messagesController = require('../controllers/messages');
const auth = require('../middleware/auth');

router.get('/', auth, messagesController.getAllMessages);

router.post('/', auth, messagesController.createMessage);

router.post('/:settingId', auth, messagesController.createMessageForSettings);

router.put('/:id', auth, messagesController.updateMessage);

router.get('/language/:lang', auth, messagesController.getMessageByLanguage);

router.get('/:id', auth, messagesController.getOneMessage);

router.delete('/:id', auth, messagesController.deleteMessage);

module.exports = router;
