/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
process.env.NODE_ENV = 'test';

const rewire = require('rewire');
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('chai').assert;
const model = require('../models/index');


const settingsRewire = rewire('../controllers/settings.js');
/* const hasProps = userRewire.__get__('hasProps') */
const getEmoticonsForSettings = settingsRewire.__get__('getEmoticonsForSettings');
const getMessage = settingsRewire.__get__('getMessage');

const server = require('../bin/www');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

const getEmoticonsGroup = async () => {
    const emoticonsGroup = await model.emoticonsGroups.findOne({
        order: [
            ['createdAt', 'ASC'],
        ],
        raw: true,
    });
    return emoticonsGroup.id;
};
const getSettings = async () => {
    const settings = await model.settings.findOne({
        order: [
            ['createdAt', 'ASC'],
        ],
        raw: true,
    });
    return settings;
};

describe('get emoticons for settings', () => {
    it('Should return array with 3-5 elements', async () => {
        const group = await getEmoticonsGroup();
        const settings = await getSettings();
        const data = await getEmoticonsForSettings(group, settings.emoticonNumber);
        assert.isAtLeast(data.length, 3);
        assert.isArray(data);
    });
});

describe('get message for settings', () => {
    it('Should return message object with all keys', async () => {
        const settings = await getSettings();
        const data = await getMessage(settings.messageId);
        assert.isObject(data);
        assert.hasAllKeys(data, ['id', 'text']);
    });
});

describe('/GET all settings', () => {
    it('it should GET all the settings', (done) => {
        chai.request(server)
            .get('/api/v1/settings')
            .set('Authorization', '123')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.error.should.be.eql(false);
                res.body.data.should.be.a('array');
                res.body.error.should.be.a('boolean');
                done();
            });
    });
});

describe('/GET/:id last setting', () => {
    it('it should GET last settings', (done) => {
        chai.request(server)
            .get('/api/v1/settings/last')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.should.have.property('data');
                res.body.error.should.be.eql(false);
                res.body.data.should.be.a('object');
                res.body.error.should.be.a('boolean');
                done();
            });
    });
});

describe('/GET/:id one setting', () => {
    it('it should GET one settings', async () => {
        const settings = await model.settings.findOne({
            order: [
                ['id', 'ASC'],
            ],
            raw: true,
        });


        chai.request(server)
            .get(`/api/v1/settings/${settings.id}`)
            .set('Authorization', '123')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.should.have.property('data');
                res.body.error.should.be.eql(false);
                res.body.data.should.be.a('object');
                res.body.error.should.be.a('boolean');
            });
    });
});
describe('/POST one message', () => {
    it('it should not POST an settings with emoticon number greater then 5 and lower than 3', (done) => {
        const emoticonNumber = 2;

        const settings = {
            emoticonNumber,
            messageId: 1,
            messageTimeout: 10,
            emoticonsGroupId: 27,
            userId: 12,
        };
        chai.request(server)
            .post('/api/v1/settings')
            .set('Authorization', '123')
            .send(settings)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(true);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Number of emoticons not in specified range!');
                done();
            });
    });

    it('it should not POST one setting with a messagetimeout greater then 10 and lower then 0', (done) => {
        const messageTimeout = 11;

        const settings = {
            emoticonNumber: 4,
            messageId: 1,
            messageTimeout,
            emoticonsGroupId: 27,
            userId: 12,
        };

        chai.request(server)
            .post('/api/v1/settings')
            .set('Authorization', '123')
            .send(settings)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(true);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Message timeout should be in range 0-10 sec!');
                done();
            });
    });

    it('it should POST one setting', (done) => {
        const settings = {
            emoticonNumber: 5,
            messageId: 4,
            messageTimeout: 4,
            emoticonsGroupId: 27,
            userId: 12,
        };

        chai.request(server)
            .post('/api/v1/settings')
            .set('Authorization', '123')
            .send(settings)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Settings have ben updated.');
                res.body.data.should.have.property('emoticonNumber');
                res.body.data.should.have.property('messageId');
                res.body.data.should.have.property('messageTimeout');
                res.body.data.should.have.property('emoticonsGroupId');
                res.body.data.should.have.property('userId');
                done();
            });
    });
});

describe('/POST one message', () => {
    it('it should UPDATE one setting', async () => {
        const settings = await model.settings.findOne({
            order: [
                ['id', 'ASC'],
            ],
            raw: true,
        });
        settings.messageTimeout = 5;
        settings.emoticonNumber = 3;
        chai.request(server)
            .put(`/api/v1/settings/${settings.id}`)
            .set('Authorization', '123')
            .send(settings)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Settings have been created.');
            });
    });
});

describe('/DELETE one setting', () => {
    it('it should DELETE one setting', async () => {
        const settings = await model.settings.findOne({
            order: [
                ['id', 'DESC'],
            ],
            raw: true,
        });

        chai.request(server)
            .delete(`/api/v1/settings/${settings.id}`)
            .set('Authorization', '123')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Settings have been deleted.');
            });
    });
});
