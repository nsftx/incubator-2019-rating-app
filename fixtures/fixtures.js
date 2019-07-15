const sequelizeFixtures = require('sequelize-fixtures');

const models = require('../models/index');

sequelizeFixtures.loadFile('fixtures/messages.json', models)
    .then(() => {
        console.log('Fixtures: messages ...');
    });
sequelizeFixtures.loadFile('fixtures/users.json', models)
    .then(() => {
        console.log('Fixtures: users ...');
    });
sequelizeFixtures.loadFile('fixtures/emoticonsGroups.json', models)
    .then(() => {
        console.log('Fixtures: emoticonsGroups ...');
    });
sequelizeFixtures.loadFile('fixtures/emoticons.json', models)
    .then(() => {
        console.log('Fixtures: emoticons ...');
    });
sequelizeFixtures.loadFile('fixtures/settings.json', models)
    .then(() => {
        console.log('Fixtures: settings ...');
    });

sequelizeFixtures.loadFile('fixtures/ratings.json', models)
    .then(() => {
        console.log('Fixtures: ratings ...');
    });
