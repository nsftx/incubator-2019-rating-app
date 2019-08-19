process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const model = require('../models/index');

const server = require('../bin/www');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);


describe('/GET messages', () => {
    it('it should GET all the messages', (done) => {
        chai.request(server)
            .get('/api/v1/messages')
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
        const message = await model.messages.findOne({
            order: [
                ['id', 'ASC'],
            ],
            raw: true,
        });

        chai.request(server)
            .get(`/api/v1/messages/${message.id}`)
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

describe('/POST one message', () => {
    it('it should not POST an message where text is longer than 120 characters', (done) => {
        const text = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500 s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.';

        const message = {
            text,
            language: 'en',
        };
        chai.request(server)
            .post('/api/v1/messages')
            .set('Authorization', '123')
            .send(message)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(true);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Text must be between 3 and 120 characters!');
                done();
            });
    });
    it('it should POST one message', (done) => {
        const message = {
            text: 'Test message!',
            language: 'en',
        };

        chai.request(server)
            .post('/api/v1/messages')
            .set('Authorization', '123')
            .send(message)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('New message has been created.');
                res.body.data.should.have.property('text');
                res.body.data.should.have.property('language');
                res.body.data.should.have.property('createdAt');
                res.body.data.should.have.property('updatedAt');
                done();
            });
    });
    it('it should not POST message without text', (done) => {
        const message = {
            text: '',
            language: 'en',
        };
        chai.request(server)
            .post('/api/v1/messages')
            .set('Authorization', '123')
            .send(message)
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

describe('/PUT one message', () => {
    it('it should not UPDATE message where text is longer than 120 characters', async () => {
        const message = await model.messages.findOne({
            order: [
                ['id', 'ASC'],
            ],
            raw: true,
        });
        const text = 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500 s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.';

        message.text = text;
        message.language = 'ba';
        chai.request(server)
            .put(`/api/v1/messages/${message.id}`)
            .set('Authorization', '123')
            .send(message)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(true);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Text must be between 3 and 120 characters!');
            });
    });

    it('it should UPDATE one message', async () => {
        const message = await model.messages.findOne({
            order: [
                ['id', 'ASC'],
            ],
            raw: true,
        });
        message.text = 'Testni text';
        message.language = 'ba';
        chai.request(server)
            .put(`/api/v1/messages/${message.id}`)
            .set('Authorization', '123')
            .send(message)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Message has been updated!');
                res.body.data[0].should.be.eql(1);
            });
    });
});

describe('/DELETE one message', () => {
    it('it should DELETE one message', async () => {
        const message = await model.messages.findOne({
            order: [
                ['id', 'DESC'],
            ],
            raw: true,
        });

        chai.request(server)
            .delete(`/api/v1/messages/${message.id}`)
            .set('Authorization', '123')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Message has been deleted.');
                res.body.data.should.be.eql(1);
            });
    });
});
