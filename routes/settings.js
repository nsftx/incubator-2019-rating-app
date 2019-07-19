const express = require('express');

const router = express.Router();
const model = require('../models/index');


router.get('/', async (req, res) => {
	model.settings.findAll({
			include: [{
					model: model.messages,
					as: 'message',
					attributes: ['id', 'text', 'language'],
				},
				{
					model: model.emoticonsGroups,
					attributes: ['id', 'name'],
				}, {
					model: model.users,
					attributes: ['id', 'first_name', 'last_name'],
				},
			],
		})
		.then(
			settings => res.json({
				error: false,
				data: settings,
			}),
		)
		.catch(error => res.json({
			error: true,
			data: [],
			message: error,
		}));
});

router.get('/last', (req, res) => {
	model.settings.findOne({
			order: [
				['createdAt', 'DESC'],
			],
			include: [{
					model: model.messages,
					as: 'message',
					attributes: ['id', 'text', 'language'],
				},
				{
					model: model.users,
					attributes: ['id', 'first_name', 'last_name'],

				},
			],
		})
		.then(
			settings => res.json({
				error: false,
				data: settings,
			}),
		)
		.catch(error => res.json({
			error: true,
			data: [],
			message: error,
		}));
});

router.get('/:id', (req, res) => {
	const settingsId = req.params.id;

	model.settings.findOne({
			where: {
				id: settingsId,
			},
			include: [{
					model: model.messages,
					as: 'message',
					attributes: ['id', 'text', 'language'],
				},
				{
					model: model.emoticonsGroups,
					attributes: ['id', 'name'],
				}, {
					model: model.users,

				},
			],
		})
		.then(settings => res.json({
			error: false,
			data: settings,
		}))
		.catch(error => res.json({
			error: true,
			message: error,
		}));
});


router.post('/', (req, res) => {
	const {
		emoticonsNo,
		message,
		timeout,
		group,
		user,
	} = req.body;
	if (typeof (emoticonsNo) !== 'undefined') {
		if (emoticonsNo < 3 || emoticonsNo > 5) {
			res.json({
				error: true,
				message: 'Number of emoticons not in specified range!',
			});
			return;
		}
	}

	if (typeof (timeout) !== 'undefined') {
		if (timeout < 0 || timeout > 10) {
			res.json({
				error: true,
				message: 'Message timeout should be in range 0-10 sec!',
			});
			return;
		}
	}

	model.settings.create({
			emoticonNumber: emoticonsNo,
			messageId: message,
			messageTimeout: timeout,
			emoticonsGroupId: group,
			userId: user,
		})
		.then(settings => res.status(201).json({
			error: false,
			data: settings,
			message: 'New settings have been created.',
		}))
		.catch(error => res.json({
			error: true,
			message: error,
		}));
});


router.put('/:id', async (req, res) => {
	const settingsId = req.params.id;

	const {
		emoticonNumber,
		messageId,
		messageTimeout,
		emoticonsGroupId,
		userId,
	} = req.body;

	if (typeof (emoticonNumber) !== 'undefined') {
		if (emoticonNumber < 3 || emoticonNumber > 5) {
			res.json({
				error: true,
				message: 'Number of emoticons not in specified range!',
			});
			return;
		}
	}

	if (typeof (messageTimeout) !== 'undefined') {
		if (messageTimeout < 0 || messageTimeout > 10) {
			res.json({
				error: true,
				message: 'Message timeout should be in range 0-10 sec!',
			});
			return;
		}
	}

	// if emoticonNumber not changed
	const old = await model.settings.findOne({
		where: {
			id: settingsId,
			emoticonNumber,
			emoticonsGroupId,
		},
		raw: true,
	});

	// if emoticonNumber not changed => update, else => create new
	if (old !== null) {
		model.settings.update({
				emoticonNumber,
				messageId,
				messageTimeout,
				emoticonsGroupId,
				userId,
			}, {
				where: {
					id: settingsId,
				},
			})
			.then(settings => res.json({
				error: false,
				data: settings,
				message: 'Settings have been updated!',
			}))
			.catch(error => res.json({
				error: true,
				message: error,
			}));
	} else {
		model.settings.create({
				emoticonNumber,
				messageId,
				messageTimeout,
				emoticonsGroupId,
				userId,
			})
			.then(settings => res.status(201).json({
				error: false,
				data: settings,
				message: 'New settings have been created.',
			}))
			.catch(error => res.json({
				error: true,

				message: error,
			}));
	}
});


/* Delete settings. */
router.delete('/:id', (req, res) => {
	const settings = req.params.id;

	model.settings.destroy({
			where: {
				id: settings,
			},
		})
		.then(resStatus => res.json({
			error: false,
			status: resStatus,
			message: 'Settings have been deleted.',
		}))
		.catch(error => res.json({
			error: true,
			message: error,
		}));
});

module.exports = router;
