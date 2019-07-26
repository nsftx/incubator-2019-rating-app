/* eslint-disable camelcase */
const express = require('express');

const router = express.Router();

const {
	OAuth2Client,
} = require('google-auth-library');

const client = new OAuth2Client('641180167952-h84f394tnm50qm8j30t101cla1k2aglh.apps.googleusercontent.com');

const model = require('../models/index');

/* GET users listing. */
router.get('/', (req, res) => {
	res.send('respond with a resource');
});

router.post('/auth', (req, res) => {
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
			return res.json({
				error: false,
				existingUser: true,
				data: currentUser,
			});
		}
		model.invites.findOne({
			where: {
				email,
			},
		}).then((existingInvite) => {
			if (!existingInvite) {
				return res.json({
					error: true,
					data: [],
					message: 'Invitation for user does not exist',
				});
			}
			model.users.create({
				googleId: sub,
				firstName: given_name,
				lastName: family_name,
				email,
				image: picture,
			}).then((newUser) => {
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
		}).catch(error => res.json({
			error: true,
			data: [],
			message: error,
		}));
	}).catch(error => res.json({
		error: true,
		data: [],
		message: error,
	}));
});

router.post('/login', (req, res) => {
	const token = req.body.idToken;
	async function verify() {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: '641180167952-h84f394tnm50qm8j30t101cla1k2aglh.apps.googleusercontent.com', // Specify the CLIENT_ID of the app that accesses the backend
			// Or, if multiple clients access the backend:
			// [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
		});
		const payload = ticket.getPayload();
		const user = payload;

		model.users.findOne({
			where: {
				googleId: user.sub,
			},
		}).then((currentUser) => {
			if (currentUser) {
				// console.log('user is: ', currentUser);
				return res.json({
					error: false,
					existingUser: true,
					data: currentUser,
				});
			}
			model.invites.findOne({
				where: {
					email: user.email,
				},
			}).then((existingInvite) => {
				if (!existingInvite) {
					return res.json({
						error: true,
						data: [],
						message: 'Invitation for user does not exist',
					});
				}
				model.users.create({
					googleId: user.sub,
					firstName: user.given_name,
					lastName: user.family_name,
					email: user.email,
					image: user.picture,
				}).then((newUser) => {
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
			}).catch(error => res.json({
				error: true,
				data: [],
				message: error,
			}));
		}).catch(error => res.json({
			error: true,
			data: [],
			message: error,
		}));
	}
	verify().catch(error => res.json({
		error: 'User not found or token expired',
		data: error,
	}));
});
module.exports = router;
