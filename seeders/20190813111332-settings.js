const model = require('../models/index');


module.exports = {
	up: async (queryInterface) => {
		const groups = await model.emoticonsGroups.findAll({
			order: [
				['id', 'DESC'],
			],
			limit: 4,
			raw: true,
		});

		const messages = await model.messages.findAll({
			raw: true,
		});

		const users = await model.users.findAll({
			raw: true,
		});

		return queryInterface.bulkInsert('settings',
			[{
					emoticonNumber: 3,
					messageId: messages[0].id,
					emoticonsGroupId: groups[0].id,
					userId: users[0].id,
					messageTimeout: 5,
				},
				{
					emoticonNumber: 3,
					messageId: messages[1].id,
					emoticonsGroupId: groups[1].id,
					userId: users[1].id,
					messageTimeout: 5,
				},
				{
					emoticonNumber: 3,
					messageId: messages[2].id,
					emoticonsGroupId: groups[2].id,
					userId: users[2].id,
					messageTimeout: 5,
				},
				{
					emoticonNumber: 3,
					messageId: messages[3].id,
					emoticonsGroupId: groups[3].id,
					userId: users[0].id,
					messageTimeout: 5,
				},
				{
					emoticonNumber: 3,
					messageId: messages[2].id,
					emoticonsGroupId: groups[1].id,
					userId: users[0].id,
					messageTimeout: 5,
				},
			]);
	},

	down: async (queryInterface) => {
		return queryInterface.bulkDelete(['settings', null, {}]);
	},
};
