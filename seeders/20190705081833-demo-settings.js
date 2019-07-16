'use strict';

module.exports = {

    up: (queryInterface) =>
      queryInterface.bulkInsert('settings', [{
        emoticon_number: 4,
        message: 'Thank you!',
        message_timeout: 5,
      }], {})
  },


  down: (queryInterface) => {
    queryInterface.bulkDelete('settings', null, {});
  },

};
