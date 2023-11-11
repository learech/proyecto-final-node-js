import { logger } from '../src/middlewares/logger.js';
import supertest from 'supertest';
import chai from 'chai';


const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing PRODUCTS ENDPOINTS', () => {

    before(async function () {
        this.timeout(5000)
        logger.info('Init all products tests')
    });


    it('Get all products TEST | GET /api/products', async () => {

        const response = await requester.get('/api/products');
        expect(response.status).to.eql(200);
        expect(response.body.success).to.eql(true);
        expect(response.body.payload).to.be.an('array');
    });


    it('Get product by id TEST | GET /api/products/:id', async () => {
        const response = await requester.get('/api/products/6478e525e2fffa91b4786682');
    
        expect(response.status).to.eql(200);
        expect(response.body).to.be.an('object');
    });

})