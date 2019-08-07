process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const model = require('../models/index');

const server = require('../bin/www');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);

// REQUEST takes too much time and is not used

/* describe('/GET ratings', () => {
    it('it should GET all the ratings', (done) => {
        chai.request(server)
            .get('/ratings')
            .set('Authorization', '123')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.error.should.be.false;
                res.body.data.should.be.a('array');
                res.body.error.should.be.a('boolean');
                done();
            });
    });
}); */

describe('/POST ratings by hour', () => {
    it('should get ratings for one day based on interval recieved in body', (done) => {
        const body = {
            date: '2019-08-06',
            interval: 2,
        };
        const dataLength = 24 / body.interval;
        chai.request(server)
            .post('/ratings/range')
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
        const body = {
            startDate: '2019-08-01',
            endDate: '2019-08-10',
        };
        const start = moment(body.startDate);
        const end = moment(body.endDate);

        const dataLength = end.diff(start, 'days') + 1;
        console.log('length:', dataLength);
        chai.request(server)
            .post('/ratings/days')
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
        const body = {
            startDate: '2019-08-01',
            endDate: '2019-08-10',
        };
        chai.request(server)
            .post('/ratings/report')
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
                res.body.data.length.should.be.lte(5);
                res.body.data.length.should.be.gte(3);
                res.body.emoticons.should.be.a('array');
                res.body.data.length.should.be.eql(res.body.emoticons.length);
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
            .post('/ratings/count')
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
            .post('/ratings')
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
});
describe('/DELETE one rating', () => {
    it('it should DELETE one rating', async () => {
        const rating = await model.ratings.findOne({
            raw: true,
        });
        chai.request(server)
            .delete(`/ratings/${rating.id}`)
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
