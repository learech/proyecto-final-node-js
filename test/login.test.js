import { logger } from '../src/middlewares/logger.js';
import supertest from 'supertest';
import chai from 'chai';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testing LOGIN-LOGOUT ENDPOINTS', () => {

    before(async function () {
        this.timeout(5000)
        logger.info('Init all login tests')
    });

    it('Login user TEST | POST /api/sessions/login', async () => {
        const response = await requester.post('/api/sessions/login').send({
            email: 'jperez@gmail.com',
            password: 'asd123'
        });

        expect(response.status).to.eql(302);
        expect(response.redirect).to.eql(true);
        expect(response.header.location).to.eql('/views/products');


    })

    it('Logout user TEST | GET /auth/logout', async () => {
        const response = await requester.get('/api/sessions/logout');
    
        expect(response.status).to.eql(302);
        expect(response.redirect).to.eql(true);
        expect(response.header.location).to.eql('/api/sessions/login');
    });

})