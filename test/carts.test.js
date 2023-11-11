import { logger } from '../src/middlewares/logger.js';
import supertest from 'supertest';
import chai from 'chai';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');



describe('Testing CART ENDPOINTS', () => {

  before(async function () {
      this.timeout(5000)
      logger.info('Init all carts tests')
  });

  let cartId;

  it('Get all carts TEST | GET /api/carts', async () => {
    const response = await requester.get('/api/carts');
    expect(response.status).to.eql(200);
    expect(response.body.success).to.eql(true);
    expect(response.body.result).to.be.an('array');
  });

  it('Cart creation TEST | POST /api/carts', async () => {
    const response = await requester.post('/api/carts').send({});
    cartId = response.body.result._id;
    expect(response.status).to.eql(200);
    expect(response.body.success).to.eql(true);
    expect(response.body.result).to.be.an('object');
    expect(response.body.result.products).to.be.an('array');
  });

  it('Get cart by id TEST | GET /api/carts/:id', async () => {
    const response = await requester.get(`/api/carts/${cartId}`);
    expect(response.status).to.eql(200);
    expect(response.body.success).to.eql(true);
    expect(response.body.result).to.be.an('array');
  });

  it('Delete cart by id TEST | DELETE /api/carts/:id/deletecart', async () => {
    const response = await requester.delete(`/api/carts/${cartId}/deletecart`);
    expect(response.status).to.eql(200);
    expect(response.body.success).to.eql(true);
    expect(response.body.result).to.be.an('object');
  });
})