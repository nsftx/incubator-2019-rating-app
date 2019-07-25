/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();
const model = require('../models/index');

/* GET users listing. */
router.get('/', (req, res) => {
	res.send('respond with a resource');
});

router.post('/login', (req, res) => {
	const {
		sub,
		given_name,
		family_name,
		picture,
		email,
	} = req.body;

	model.users.findOne({
		where: {
			googleId: sub,
		},
	}).then((currentUser) => {
		if (currentUser) {
			// console.log('user is: ', currentUser);
			res.json({
				error: false,
				existingUser: true,
				data: currentUser,
			});
		} else {
			model.invites.findOne({
				where: {
					email,
				},
			}).then((existingInvite) => {
				console.log('invite');
				if (existingInvite) {
					console.log('inviteExists');
					model.users.create({
						googleId: sub,
						firstName: given_name,
						lastName: family_name,
						email,
						image: picture,
					}).then((newUser) => {
						// console.log('created new user: ', newUser);
						res.json({
							error: false,
							existingUser: false,
							data: newUser,
						});
					}).catch(error => res.json({
						error: true,
						data: [],
						message: error,
					}));
				} else {
					res.json({
						error: true,
						data: [],
						message: 'Invitation for user does not exist',
					});
				}
			}).catch(error => res.json({
				error: true,
				data: [],
				message: error,
			}));
		}
	}).catch(error => res.json({
		error: true,
		data: [],
		message: error,
	}));
});
module.exports = router;
