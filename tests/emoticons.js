process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const model = require('../models/index');

const server = require('../bin/www');
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);


describe('/GET emoticons', () => {
    it('it should GET all the emoticons', (done) => {
        chai.request(server)
            .get('/api/v1/emoticons')
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

describe('/GET/:id one emoticon', () => {
    it('it should GET one emoticon by the given id', async () => {
        const emoticon = await model.emoticons.findOne({
            order: [
                ['id', 'ASC'],
            ],
            raw: true,
        });
        /* const emoticon = {
                    id: 117
                };
         */

        chai.request(server)
            .get(`/api/v1/emoticons/${emoticon.id}`)
            .set('Authorization', '123')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.error.should.be.eql(false);
                res.body.data.should.be.a('object');
                res.body.error.should.be.a('boolean');
            });
    });
});

describe('/POST one emoticon', () => {
    it('it should not POST an emoticon without emoticonsGroupId', (done) => {
        const emoticon = {
            name: 'test',
            symbol: 'fas fa-test',
            value: 1,
        };
        chai.request(server)
            .post('/api/v1/emoticons')
            .set('Authorization', '123')
            .send(emoticon)
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
    it('it should POST one emoticon', async () => {
        const emoticonsGroup = await model.emoticonsGroups.findOne({
            raw: true,
        });
        const emoticon = {
            name: 'test',
            emoticonsGroupId: emoticonsGroup.id,
            symbol: 'fas fa-test',
            value: 1,
        };

        chai.request(server)
            .post('/api/v1/emoticons')
            .set('Authorization', '123')
            .send(emoticon)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');

                res.body.should.have.property('message')
                    .eql('New emoticon has been created.');
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('emoticonsGroupId');
                res.body.data.should.have.property('symbol');
                res.body.data.should.have.property('value');
                res.body.data.should.have.property('createdAt');
                res.body.data.should.have.property('updatedAt');
            });
    });
});

describe('/PUT one emoticon', () => {
    it('it should UPDATE one emoticon', async () => {
        const emoticon = await model.emoticons.findOne({
            raw: true,
        });
        emoticon.value = 2;
        chai.request(server)
            .put(`/api/v1/emoticons/${emoticon.id}`)
            .set('Authorization', '123')
            .send(emoticon)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Emoticon has been updated.');
                res.body.data[0].should.be.eql(1);
            });
    });
});

describe('/DELETE one emoticon', () => {
    it('it should DELETE one emoticon', async () => {
        const emoticon = await model.emoticons.findOne({
            raw: true,
        });
        chai.request(server)
            .delete(`/api/v1/emoticons/${emoticon.id}`)
            .set('Authorization', '123')
            .send(emoticon)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Emoticon has been deleted.');
                res.body.data.should.be.eql(1);
            });
    });
});
