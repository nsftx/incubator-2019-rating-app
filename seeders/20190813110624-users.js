module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('users',
      [{
          firstName: 'Test',
          lastName: 'User',
          email: 'test123@ussser.com',
          image: 'https://www.policymed.com/wp-content/uploads/2013/04/6a00e5520572bb8834017c3875ac22970b.jpg',
          token: '123',
          isSuperAdmin: 0,
          googleId: '1298445135019',
        },
        {
          firstName: 'Nsoft',
          lastName: 'Devhive',
          email: 'nsoft@devhive.com',
          image: '',
          token: '234',
          isSuperAdmin: 0,
          googleId: '129123840',
        },
        {
          firstName: 'Dev',
          lastName: 'Spark',
          email: 'spark@dev.to',
          image: 'https://www.policymed.com/wp-content/uploads/2013/04/6a00e5520572bb8834017c3875ac22970b.jpg',
          token: '345',
          isSuperAdmin: 0,
          googleId: '12984011239',
        },
        {
          firstName: 'Korisnik',
          lastName: 'Testni',
          email: 'testni@korisnik.ba',
          image: 'https://www.policymed.com/wp-content/uploads/2013/04/6a00e5520572bb8834017c3875ac22970b.jpg',
          token: '456',
          isSuperAdmin: 0,
          googleId: '1298401913437',
        },
        {
          firstName: 'Red',
          lastName: 'John',
          email: 'redjohn@mentalist.com',
          image: 'https://vignette.wikia.nocookie.net/thementalist/images/9/93/220px-Red-John-Smiley-Face.png/revision/latest?cb=20111105114449',
          token: '567',
          isSuperAdmin: 0,
          googleId: '129840193712',
        },
      ]);
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete(['users', null, {}]);
  },
};
