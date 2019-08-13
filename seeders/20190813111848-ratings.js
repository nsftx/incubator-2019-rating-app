const model = require('../models/index');

const filterEmoticons = async (emoticons, emoticonNumber) => {
  let filteredEmoticons = [];
  if (emoticonNumber === 3) {
    for (let i = 0; i < emoticons.length; i += 2) {
      filteredEmoticons.push(emoticons[i]);
    }
  } else if (emoticonNumber === 4) {
    const middleElementIndex = parseInt(emoticons.length / 2, 10);
    filteredEmoticons = emoticons;
    emoticons.splice(middleElementIndex, 1);
  } else {
    filteredEmoticons = emoticons;
  }
  return filteredEmoticons;
};

module.exports = {
  up: async (queryInterface) => {
    const settings = await model.settings.findOne({
      order: [
        ['createdAt', 'DESC'],
      ],
      raw: true,
    });

    const emoticons = await model.emoticons.findAll({
      where: {
        emoticonsGroupId: settings.emoticonsGroupId,
      },
      raw: true,
    });

    const filteredEmoticons = await filterEmoticons(emoticons, settings.emoticonNumber);

    return queryInterface.bulkInsert('ratings',
      [{
          time: new Date(),
          settingId: settings.id,
          emoticonId: filteredEmoticons[Math.floor(Math.random() * filteredEmoticons.length)].id,
        },
        {
          time: new Date(),
          settingId: settings.id,
          emoticonId: filteredEmoticons[Math.floor(Math.random() * filteredEmoticons.length)].id,
        },
        {
          time: new Date(),
          settingId: settings.id,
          emoticonId: filteredEmoticons[Math.floor(Math.random() * filteredEmoticons.length)].id,
        },
        {
          time: new Date(),
          settingId: settings.id,
          emoticonId: filteredEmoticons[Math.floor(Math.random() * filteredEmoticons.length)].id,
        },
        {
          time: new Date(),
          settingId: settings.id,
          emoticonId: filteredEmoticons[Math.floor(Math.random() * filteredEmoticons.length)].id,
        },
      ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete(['ratings', null, {}]);
  },
};
