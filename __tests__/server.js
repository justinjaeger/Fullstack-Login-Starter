const request = require('supertest');
const server = 'http://localhost:3000';

/**
 * REMEMBER: You have to be running the server to run these tests - and has to be production server
 * 
 * Read the docs https://www.npmjs.com/package/supertest
 * Note that we return the evaluation of `request` here! It evaluates to 
 * a promise, so Jest knows not to say this test passes until that
 * promise resolves. See https://jestjs.io/docs/en/asynchronous
*/

describe('Route integration', () => {
  describe('/', () => {
    describe('GET', () => {
      it('responds with 200 status and text/html content type', () => {
        return request(server)
          .get('/')
          .expect('Content-Type', /text\/html/)
          .expect(200);
      });
      it('responds with 400 status when the route is nonsense', () => {
        return request(server)
          .get('/aklsjdfljasdfoiasf9jiaf')
          .expect(400);
      });
    });
  });
});
