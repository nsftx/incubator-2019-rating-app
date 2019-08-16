process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const model = require('../models/index');

const server = require('../bin/www');

// eslint-disable-next-line no-unused-vars
const should = chai.should();

chai.use(chaiHttp);


describe('/POST new invite', () => {
    it('it should not POST if invite already exist', async () => {
        const invite = await model.invites.findOne({
            raw: true,
        });
        chai.request(server)
            .post('/api/v1/invites')
            .set('Authorization', '123')
            .send(invite)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(true);
                res.body.error.should.be.a('boolean');
                res.body.should.have.property('message')
                    .eql('Invitation already exists!');
            });
    });
    it('it should POST if invite does not exist', async () => {
        function stringGen(len) {
            let text = '';

            const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

            for (let i = 0; i < len; i += 1) {
                text += charset.charAt(Math.floor(Math.random() * charset.length));
            }


            return text;
        }
        const email = `${await stringGen(7)}@${await stringGen(5)}.${await stringGen(5)}`;
        const invite = {
            email,
        };
        chai.request(server)
            .post('/api/v1/invites')
            .set('Authorization', '123')
            .send(invite)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.be.eql(false);
                res.body.error.should.be.a('boolean');
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('email');
                res.body.data.should.have.property('createdAt');
                res.body.data.should.have.property('updatedAt');
            });
    });
    it('it should not POST if there is no email', (done) => {
        const invite = {
            email: '',
        };
        chai.request(server)
            .post('/api/v1/invites')
            .set('Authorization', '123')
            .send(invite)
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
