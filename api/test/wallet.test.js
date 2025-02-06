import request from 'supertest';
import { expect } from 'chai';
import { describe } from 'mocha';

import app from '../server.js';

describe('Wallet API Tests', () => {
    it('should create a new wallet', (done) => {
        request(app)
            .post('/api/v1/wallets/create')
            .end((err, res) => {
                if (err) return done(err);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('walletIds');
                done();
            });
    });

    it('should get wallet balance', (done) => {
        request(app)
            .get('/api/v1/wallets/balance')
            .query({ walletID: '8855cb91-e040-518b-920f-5220557fb2f9' })
            .end((err, res) => {
                if (err) return done(err);
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('balances');
                done();
            });
    });

    it('should fail getting a wallet', (done) => {
        request(app)
            .get('/api/v1/wallets/balance')
            .query({ walletId: 'invalid-wallet-id' })
            .end((err, res) => {
                if (err) return done(err);
                expect(res.status).to.equal(400);
                done();
            });
    });
});