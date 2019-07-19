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
          name: 'star 1',
          symbol: 'far fa-star',
          value: 1,
          emoticonsGroupId: groups[0][i - 1].id,
        },
        {
          name: 'star 2',
          symbol: 'far fa-star',
          value: 2,
          emoticonsGroupId: groups[0][i - 1].id,
        },
        {
          name: 'star 3',
          symbol: 'far fa-star',
          value: 3,
          emoticonsGroupId: groups[0][i - 1].id,
        },
        {
          name: 'star 4',
          symbol: 'far fa-star',
          value: 4,
          emoticonsGroupId: groups[0][i - 1].id,
        },
        {
          name: 'star 5',
          symbol: 'far fa-star',
          value: 5,
          emoticonsGroupId: groups[0][i - 1].id,
        },
        {
          name: 'heart 1',
          symbol: 'far fa-heart',
          value: 1,
          emoticonsGroupId: groups[0][i - 2].id,
        },
        {
          name: 'heart 2',
          symbol: 'far fa-heart',
          value: 2,
          emoticonsGroupId: groups[0][i - 2].id,
        },
        {
          name: 'heart 3',
          symbol: 'far fa-heart',
          value: 3,
          emoticonsGroupId: groups[0][i - 2].id,
        },
        {
          name: 'heart 4',
          symbol: 'far fa-heart',
          value: 4,
          emoticonsGroupId: groups[0][i - 2].id,
        },
        {
          name: 'heart 5',
          symbol: 'far fa-heart',
          value: 5,
          emoticonsGroupId: groups[0][i - 2].id,
        },
        {
          name: 'thumbs 1',
          symbol: 'far fa-thumbs-up',
          value: 1,
          emoticonsGroupId: groups[0][i - 3].id,
        },
        {
          name: 'thumbs 2',
          symbol: 'far fa-thumbs-up',
          value: 2,
          emoticonsGroupId: groups[0][i - 3].id,
        },
        {
          name: 'thumbs 3',
          symbol: 'far fa-thumbs-up',
          value: 3,
          emoticonsGroupId: groups[0][i - 3].id,
        },
        {
          name: 'thumbs 4',
          symbol: 'far fa-thumbs-up',
          value: 4,
          emoticonsGroupId: groups[0][i - 3].id,
        },
        {
          name: 'thumbs 5',
          symbol: 'far fa-thumbs-up',
          value: 5,
          emoticonsGroupId: groups[0][i - 3].id,
        },
        {
          name: 'angry',
          symbol: 'fas fa-angry',
          value: 1,
          emoticonsGroupId: groups[0][i - 4].id,
        },
        {
          name: 'frown',
          symbol: 'fas fa-frown',
          value: 2,
          emoticonsGroupId: groups[0][i - 4].id,
        },
        {
          name: 'meh',
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
          name: 'grin',
          symbol: 'fas fa-grin',
          value: 5,
          emoticonsGroupId: groups[0][i - 4].id,
        },
      ]);
  },

  down: async (queryInterface) => {
    queryInterface.bulkDelete(['emoticons', null, {}], ['emoticonsGroups', null, {}]);
  },
};
