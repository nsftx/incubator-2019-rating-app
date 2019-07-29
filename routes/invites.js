const express = require('express');

const router = express.Router();
const model = require('../models/index');
const auth = require('../middleware/auth');

/* GET users listing. */
router.post('/', auth, (req, res) => {
    const {
        email,
    } = req.body;

    model.invites.findOne({
        where: {
            email,
        },
    }).then((existingInvite) => {
        if (existingInvite) {
            // console.log('user is: ', currentUser);
            res.json({
                error: true,
                message: 'Invitation already exists!',
                data: existingInvite,
            });
        } else {
            model.invites.create({
                email,
            }).then((newInvite) => {
                // console.log('created new user: ', newUser);
                res.json({
                    error: false,
                    data: newInvite,
                });
            }).catch(error => res.json({
                error: true,
                data: [],
                message: error,
            }));
        }
    });
});

module.exports = router;
