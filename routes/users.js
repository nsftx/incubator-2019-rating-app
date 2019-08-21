/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

const usersController = require('../controllers/users');

router.post('/login', usersController.userlogin);
router.post('/user', auth, usersController.getUserByEmail);
router.get('/:id', auth, usersController.getUser);
router.delete('/', auth, usersController.deleteUser);

module.exports = router;
