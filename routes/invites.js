const express = require('express');


const router = express.Router();
const auth = require('../middleware/auth');
const invitesController = require('../controllers/invites');

/* GET users listing. */
router.post('/', auth, invitesController.sendInvite);

module.exports = router;
