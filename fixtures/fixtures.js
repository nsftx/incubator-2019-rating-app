const sequelize_fixtures = require('sequelize-fixtures');

const models = require('../models/index');

sequelize_fixtures.loadFile('fixtures/messages.json', models)
    .then(function () {
        console.log('Fixtures: messages ...');
    });
sequelize_fixtures.loadFile('fixtures/users.json', models)
    .then(function () {
        console.log('Fixtures: users ...');
    });
sequelize_fixtures.loadFile('fixtures/emoticonsGroups.json', models)
    .then(function () {
        console.log('Fixtures: emoticonsGroups ...');
    });
sequelize_fixtures.loadFile('fixtures/emoticons.json', models)
    .then(function () {
        console.log('Fixtures: emoticons ...');
    });
sequelize_fixtures.loadFile('fixtures/settings.json', models)
    .then(function () {
        console.log('Fixtures: settings ...');
    });

sequelize_fixtures.loadFile('fixtures/ratings.json', models)
    .then(function () {
        console.log('Fixtures: ratings ...');
    });