module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('messages',
      [{
          text: 'Thank you for your rating!',
          language: 'en',
        },
        {
          text: 'Hvala na Vašoj ocjeni',
          language: 'hr',
        },
        {
          text: 'Vielen Dank für Ihre Bewertung!',
          language: 'de',
        },
        {
          text: 'Grazie per la tua valutazione!',
          language: 'it',
        },
        {
          text: 'Спасибо за ваш рейтинг!',
          language: 'ru',
        },
      ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete(['messages', null, {}]);
  },
};
