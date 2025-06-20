import { it, test, beforeAll, afterAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a new transaction', async () => {
        const response = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)

        console.log(response.header)
        // or expect(response.statusCode).toEqual(201)
    })

    // or test
    it('should be able to list all transactions', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse:any = await request(app.server)
            .get('/transactions')
            .set('Cookie', (cookies as any))
            .expect(200)

        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            }),
        ])
    })

})

