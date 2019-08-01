const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();
const model = require('../models/index');
const auth = require('../middleware/auth');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ratings.app3@gmail.com',
        pass: 'Newsmay1!',
    },
});

/* GET users listing. */
router.post('/', auth, (req, res) => {
    const {
        email,
    } = req.body;

    model.invites.findOne({
        where: {
            email,
        },
    }).then(async (existingInvite) => {
        if (existingInvite) {
            // console.log('user is: ', currentUser);
            res.json({
                error: true,
                message: 'Invitation already exists!',
                data: existingInvite,
            });
        } else {
            await model.invites.create({
                email,
            }).then((newInvite) => {
                // console.log('created new user: ', newUser);
                const mailOptions = {
                    from: 'ratings.app3@gmail.com',
                    to: email,
                    subject: 'App invite test',
                    text: 'That was easy!',
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log(`Email sent: ${info.response}`);
                    }
                });
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
