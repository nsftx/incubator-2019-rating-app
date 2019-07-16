module.exports = {
  up: async (queryInterface) => {
    queryInterface.bulkInsert('emoticonsGroups',
      [{
          name: 'stars',
        },
        {
          name: 'hearts',
        },
        {
          name: 'thumbs',
        },
        {
          name: 'smileys',
        },
      ]);
    const groups = await queryInterface.sequelize.query(
      'SELECT id FROM emoticonsGroups ORDER BY id DESC LIMIT 4',
    );
    const i = groups[0].length;

    return queryInterface.bulkInsert('emoticons',
      [{
          name: 'star',
          symbol: 'fal fa-star',
          value: 1,
          emoticonsGroupId: groups[0][i - 1].id,
        },
        {
          name: 'star',
          symbol: 'fal fa-star',
          value: 2,
          emoticonsGroupId: groups[0][i - 1].id,
        },
        {
          name: 'star',
          symbol: 'fal fa-star',
          value: 3,
          emoticonsGroupId: groups[0][i - 1].id,
        },
        {
          name: 'star',
          symbol: 'fal fa-star',
          value: 4,
          emoticonsGroupId: groups[0][i - 1].id,
        },
        {
          name: 'star',
          symbol: 'fal fa-star',
          value: 5,
          emoticonsGroupId: groups[0][i - 1].id,
        },
        {
          name: 'heart',
          symbol: 'far fa-heart',
          value: 1,
          emoticonsGroupId: groups[0][i - 2].id,
        },
        {
          name: 'heart',
          symbol: 'far fa-heart',
          value: 2,
          emoticonsGroupId: groups[0][i - 2].id,
        },
        {
          name: 'heart',
          symbol: 'far fa-heart',
          value: 3,
          emoticonsGroupId: groups[0][i - 2].id,
        },
        {
          name: 'heart',
          symbol: 'far fa-heart',
          value: 4,
          emoticonsGroupId: groups[0][i - 2].id,
        },
        {
          name: 'heart',
          symbol: 'far fa-heart',
          value: 5,
          emoticonsGroupId: groups[0][i - 2].id,
        },
        {
          name: 'thumbs',
          symbol: 'far fa-thumbs-up',
          value: 1,
          emoticonsGroupId: groups[0][i - 3].id,
        },
        {
          name: 'thumbs',
          symbol: 'far fa-thumbs-up',
          value: 2,
          emoticonsGroupId: groups[0][i - 3].id,
        },
        {
          name: 'thumbs',
          symbol: 'far fa-thumbs-up',
          value: 3,
          emoticonsGroupId: groups[0][i - 3].id,
        },
        {
          name: 'thumbs',
          symbol: 'far fa-thumbs-up',
          value: 4,
          emoticonsGroupId: groups[0][i - 3].id,
        },
        {
          name: 'thumbs',
          symbol: 'far fa-thumbs-up',
          value: 5,
          emoticonsGroupId: groups[0][i - 3].id,
        },
        {
          name: 'smile',
          symbol: 'fas fa-angry',
          value: 1,
          emoticonsGroupId: groups[0][i - 4].id,
        },
        {
          name: 'smile',
          symbol: 'fas fa-frown',
          value: 2,
          emoticonsGroupId: groups[0][i - 4].id,
        },
        {
          name: 'smile',
          symbol: 'fas fa-meh',
          value: 3,
          emoticonsGroupId: groups[0][i - 4].id,
        },
        {
          name: 'smile',
          symbol: 'fas fa-smile',
          value: 4,
          emoticonsGroupId: groups[0][i - 4].id,
        },
        {
          name: 'smile',
          symbol: 'fas fa-grin',
          value: 5,
          emoticonsGroupId: groups[0][i - 4].id,
        },
      ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete(['emoticons', null, {}], ['emoticonsGroups', null, {}]);
  },
};
