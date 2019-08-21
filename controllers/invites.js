const nodemailer = require('nodemailer');
const model = require('../models/index');
require('dotenv').config('/.env');

const response = require('../helpers/responses');


const emailIsValid = (email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

const classic = (error, data, message = '') => {
    const res = {
        error,
        data,
        message,
    };
    return res;
};

exports.sendInvite = async (req, res) => {
    const {
        email,
    } = req.body;

    if (!email) {
        return res.status(400).json(response.classic(true, {}, 'Email not defined'));
    }

    if (!emailIsValid(email)) {
        return res.status(400).json(response.classic(true, email, 'Invalid email'));
    }

    model.invites.findOne({
            where: {
                email,
            },
        })
        .then(async (existingInvite) => {
            if (existingInvite) {
                // console.log('user is: ', currentUser);
                res.status(400).json(
                    response.classic(true, existingInvite, 'Invitation already exists!'),
                );
            } else {
                await model.invites.create({
                    email,
                }).then((newInvite) => {
                    // console.log('created new user: ', newUser);
                    const mailOptions = {
                        from: process.env.APP_EMAIL,
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
                    return res.json(response.classic(false, newInvite));
                }).catch(() => res.json(
                    response.classic(true, [], 'Server error'),
                ));
            }
        });
    return 1;
};
