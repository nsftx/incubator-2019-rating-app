process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const model = require('../models/index');

const server = require('../bin/www');
// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);


const getEmoticonsGroup = async () => {
    const group = await model.emoticonsGroups.findOne({
            order: [
                ['id', 'DESC'],
            ],
            raw: true,
        });
    return group;
};


describe('/GET all emoticonsGroups', () => {
    it('it should GET all the emoticons', (done) => {
        chai.request(server)
            .get('/api/v1/emoticonsGroups')
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

describe('/GET/:id one emoticonsGroup', () => {
    it('it should GET one emoticonGroup by the given id', async () => {
        const emoticonsGroups = await getEmoticonsGroup();
        chai.request(server)
            .get(`/api/v1/emoticonsGroups/${emoticonsGroups.id}`)
            .set('Authorization', '123')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.should.have.property('data');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.data.should.be.a('object');
            });
    });
});

describe('/POST one emoticonsGroup', () => {
    it('it should not POST an emoticonGroup without name', (done) => {
        const emoticon = {
            name: '',
        };
        chai.request(server)
            .post('/api/v1/emoticonsGroups')
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
    it('it should POST an emoticonGroup', (done) => {
        const emoticon = {
            name: 'test',
        };
        chai.request(server)
            .post('/api/v1/emoticonsGroups')
            .set('Authorization', '123')
            .send(emoticon)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');

                res.body.should.have.property('message')
                    .eql('New emoticon group has been created.');
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('createdAt');
                res.body.data.should.have.property('updatedAt');
                done();
            });
    });
});

describe('/PUT one emoticonsGroup', () => {
    it('it should UPDATE one emoticonGroup', async () => {
        const emoticonsGroup = await getEmoticonsGroup();
        emoticonsGroup.name = 'test 2';
        chai.request(server)
            .put(`/api/v1/emoticonsGroups/${emoticonsGroup.id}`)
            .set('Authorization', '123')
            .send(emoticonsGroup)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Emoticons group has been updated.');
                res.body.data[0].should.be.eql(1);
            });
    });
});

describe('/DELETE one emoticonsGroup', () => {
    it('it should DELETE one emoticonGroup', async () => {
        const emoticonsGroup = await getEmoticonsGroup();
        chai.request(server)
            .delete(`/api/v1/emoticonsGroups/${emoticonsGroup.id}`)
            .set('Authorization', '123')
            .send(emoticonsGroup)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                /* res.body.error.should.be.false;
                res.body.error.should.be.a('boolean'); */
                res.body.should.have.property('message')
                    .eql('Emoticons group has been deleted.');
            });
    });
});
