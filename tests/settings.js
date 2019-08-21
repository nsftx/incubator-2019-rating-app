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
        const settings = await getSettings();
        const data = await getEmoticonsForSettings(settings.emoticonsGroupId,
            settings.emoticonNumber);
        assert.isAtLeast(data.length, 3);
        assert.isAtMost(data.length, 5);
        assert.isArray(data);
    });
});

describe('get message for settings', () => {
    it('Should return message object with required keys', async () => {
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
        const settings = await getSettings();
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
describe('/PUT one settings', () => {
    it('it should UPDATE one setting', async () => {
        const settings = await getSettings();
        if (settings.emoticonNumber === 5) {
            settings.emoticonNumber -= 1;
        } else {
            settings.emoticonNumber += 1;
        }
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
    it('it should not UPDATE settings without emoticonNumber', async () => {
        const settings = await getSettings();
        settings.emoticonNumber = undefined;
        chai.request(server)
            .put(`/api/v1/settings/${settings.id}`)
            .set('Authorization', '123')
            .send(settings)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(true);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message');
            });
    });
    it('it should not UPDATE settings without messageId', async () => {
        const settings = await getSettings();
        settings.messageId = undefined;
        chai.request(server)
            .put(`/api/v1/settings/${settings.id}`)
            .set('Authorization', '123')
            .send(settings)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(true);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message');
            });
    });
    it('it should not UPDATE settings without emoticonsGroupId', async () => {
        const settings = await getSettings();
        settings.emoticonsGroupId = undefined;
        chai.request(server)
            .put(`/api/v1/settings/${settings.id}`)
            .set('Authorization', '123')
            .send(settings)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(true);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message');
            });
    });
    it('it should not UPDATE settings without userId', async () => {
        const settings = await getSettings();
        settings.userId = undefined;
        chai.request(server)
            .put(`/api/v1/settings/${settings.id}`)
            .set('Authorization', '123')
            .send(settings)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(true);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message');
            });
    });
});
/* describe('/DELETE one setting', () => {
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
}); */
