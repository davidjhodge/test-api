var chai = require('chai')
var chaiHttp = require('chai-http')
var server = require('../app.js')
var should = chai.should()

chai.use(chaiHttp)

// Describe() is used to group tests together
describe('Blobs', (done) => {
  // It() describes a single feature or test case
  it('should list ALL blobs on /blobs GET');
  it('should list a SINGLE user on /users/<id> GET', (done) => {
    const userId = 9
    const authToken = 'eyJhbGciOiJIUzI1NiJ9.cmlja0BnbWFpbC5jb20.7hT58C5SaAbbKMPOuYgYNLx1rZVuZo1fvx9r8KRSYPU'
    chai.request(server)
      .get('/users/' + userId)
      .set('Authorization', 'Bearer ' + authToken)
      .end((err,res) => {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.have.property('id')
        res.body.should.have.property('username')
        res.body.should.have.property('created_at')
        done()
      })
  });
  it('should add a SINGLE blob on /blobs POST');
  it('should update a SINGLE blob on /blob/<id> PUT');
  it('should delete a SINGLE blob on /blob/<id> DELETE');
});
