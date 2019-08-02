/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

const usersController = require('../controllers/users');

router.post('/login', usersController.userlogin);

module.exports = router;
