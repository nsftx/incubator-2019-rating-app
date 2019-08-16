/* eslint-disable no-underscore-dangle */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('chai').assert;
const moment = require('moment');
const rewire = require('rewire');
const model = require('../models/index');

const server = require('../bin/www');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);
const ratingsRewire = rewire('../controllers/ratings.js');

const getCurrentSettings = ratingsRewire.__get__('getCurrentSettings');
const getEmoticons = ratingsRewire.__get__('getEmoticons');
const getEmoticonsForSettings = ratingsRewire.__get__('getEmoticonsForSettings');

const getSettings = async () => {
    const settings = await model.settings.findOne({
        order: [
            ['createdAt', 'ASC'],
        ],
        raw: true,
    });
    return settings;
};

describe('get current settings', () => {
    it('Should return an object', async () => {
        const data = await getCurrentSettings();
        assert.isObject(data);
    });
});

describe('get emoticons', () => {
    it('Should return an array', async () => {
        const settings = await getSettings();
        const data = await getEmoticons(settings.emoticonsGroupId);
        assert.isArray(data);
        assert.equal(data.length, 5);
    });
});

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

describe('get emoticons', () => {
    it('Should return an array', async () => {
        const settings = await getSettings();
        const data = await getEmoticons(settings.emoticonsGroupId);
        assert.isArray(data);
        assert.equal(data.length, 5);
    });
});

// REQUEST takes too much time and is not used

describe('/GET ratings', () => {
    it.skip('it should GET all the ratings', (done) => {
        chai.request(server)
            .get('/ratings')
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

describe('/POST ratings by hour', () => {
    it('should get ratings for one day based on interval recieved in body', (done) => {
        const body = {
            date: '2019-08-06',
            interval: 2,
        };
        const dataLength = 24 / body.interval;
        chai.request(server)
            .post('/api/v1/ratings/range')
            .set('Authorization', '123')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.error.should.be.eql(false);
                res.body.data.should.be.a('array');
                res.body.error.should.be.a('boolean');
                res.body.data.length.should.be.eql(dataLength);
                res.body.emoticons.should.be.a('array');
                done();
            });
    });
});
describe('/POST ratings by days', () => {
    it('Should get ratings for more days based on interval recieved in body', (done) => {
        const startDate = moment().subtract(10, "days").format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');

        const body = {
            startDate,
            endDate,
        };
        const start = moment(body.startDate);
        const end = moment(body.endDate);

        const dataLength = end.diff(start, 'days') + 1;
        console.log('length:', dataLength);
        chai.request(server)
            .post('/api/v1/ratings/days')
            .set('Authorization', '123')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.error.should.be.eql(false);
                res.body.data.should.be.a('array');
                res.body.error.should.be.a('boolean');
                res.body.data.length.should.be.eql(dataLength);
                res.body.emoticons.should.be.a('array');
                res.body.emoticons.should.be.a('array');
                done();
            });
    });
});

describe('/POST ratings count for more days', () => {
    it('Should get count of ratings for more days based on interval recieved in body', (done) => {
        const startDate = moment().subtract(10, 'days').format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');

        const body = {
            startDate,
            endDate,
        };
        chai.request(server)
            .post('/api/v1/ratings/report')
            .set('Authorization', '123')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.lte(5);
                res.body.data.length.should.be.gte(3);
                done();
            });
    });
});

describe('/POST ratings count one day', () => {
    it('Should get count of ratings for more days based on interval recieved in body', (done) => {
        const body = {
            date: '2019-08-06',
        };
        chai.request(server)
            .post('/api/v1/ratings/count')
            .set('Authorization', '123')
            .send(body)
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
describe('/POST ratings', () => {
    it('Should create new rating', async () => {
        const settings = await model.settings.findOne({
            order: [
                ['createdAt', 'DESC'],
            ],
            raw: true,
        });

        const emoticon = await model.emoticons.findOne({
            where: {
                emoticonsGroupId: settings.emoticonsGroupId,
            },
            raw: true,
        });

        const body = {
            emoticonId: emoticon.id,
        };

        chai.request(server)
            .post('/api/v1/ratings')
            .set('Authorization', '123')
            .send(body)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.error.should.be.eql(false);
                res.body.data.should.be.a('object');
                res.body.error.should.be.a('boolean');
                res.body.data.should.have.property('emoticonId');
                res.body.data.should.have.property('time');
                res.body.data.should.have.property('settingId');
                res.body.data.should.have.property('createdAt');
                res.body.data.should.have.property('updatedAt');
                res.body.should.have.property('message')
                    .eql('New reaction have been added.');
            });
    });
    it('it should not POST an new rating without emoticonsId', (done) => {
        const rating = {
            emoticonId: null
        };
        chai.request(server)
            .post('/api/v1/ratings')
            .set('Authorization', '123')
            .send(rating)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(true);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message');
                done();
            });
    });
});
describe('/DELETE one rating', () => {
    it('it should DELETE one rating', async () => {
        const rating = await model.ratings.findOne({
            raw: true,
        });
        chai.request(server)
            .delete(`/api/v1/ratings/${rating.id}`)
            .set('Authorization', '123')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Rating has been deleted.');
                res.body.data.should.be.eql(1);
            });
    });
});