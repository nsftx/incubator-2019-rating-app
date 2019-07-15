'use strict';

module.exports = {

  up: (queryInterface) => {
    return queryInterface.bulkInsert('settings', [{
      emoticon_number: 4,
      message: "Thank you!",
      message_timeout: 5
    }], {});
  },


  down: (queryInterface) => {
    return queryInterface.bulkDelete('settings', null, {});
  }
};