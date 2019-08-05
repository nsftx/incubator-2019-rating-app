/* eslint-disable global-require */
const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const settingsController = require('../controllers/settings');

router.get('/', auth, settingsController.getAllSettings);

router.get('/last', settingsController.getLastSettings);

router.get('/:id', auth, settingsController.getOneSettings);

router.post('/', auth, settingsController.createSettings);

router.put('/:id', auth, settingsController.updateSettings);

/* Delete settings. */
router.delete('/:id', auth, settingsController.deleteSettings);

router.post('/test', settingsController.testRouteSettings);
module.exports = router;
