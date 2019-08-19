const nodemailer = require('nodemailer');
const model = require('../models/index');
require('dotenv').config('/.env');


const emailIsValid = (email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendInvite = async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({
            error: true,
            data: {},
            message: 'Email not defined',
        });
    }

    if (!emailIsValid(email)) {
        return res.status(400).json({
            error: true,
            message: 'Invalid email',
            data: email,
        });
    }

    model.invites.findOne({
            where: {
                email,
            },
        })
        .then(async (existingInvite) => {
            if (existingInvite) {
                // console.log('user is: ', currentUser);
                res.status(400).json({
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
                    return res.json({
                        error: false,
                        data: newInvite,
                    });
                }).catch(() => res.json({
                    error: true,
                    data: [],
                    message: 'Server error, invite not created!',
                }));
            }
        });
    return 1;
};
