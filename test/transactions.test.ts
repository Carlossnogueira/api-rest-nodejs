import { it, test, beforeAll, afterAll, describe, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../src/app'
import { beforeEach } from 'node:test'


describe('Transactions routes', () => {
    beforeAll(async () => {

        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    beforeEach(() => {
        execSync('nom run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
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

        const listTransactionsResponse: any = await request(app.server)
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


    it('should be able to get a specific transaction', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit',
            })

        const cookies = createTransactionResponse.get('Set-Cookie')

        const listTransactionsResponse = await request(app.server)
            .get('/transactions')
            .set('Cookie', (cookies as any))
            .expect(200)

        const transactionId = listTransactionsResponse.body.transactions[0].id

        const getTransactionResponse = await request(app.server)
            .get(`/transactions/${transactionId}`)
            .set('Cookie', (cookies as any))
            .expect(200)

        expect(getTransactionResponse.body.transaction).toEqual(
            expect.objectContaining({
                title: 'New transaction',
                amount: 5000,
            }),
        )
    })

    it('should be able to get the summary ', async () => {
        const createTransactionResponse = await request(app.server)
            .post('/transactions')
            .send({
                title: 'New transaction',
                amount: 5000,
                type: 'credit'
            })
            .expect(201)

        const cookies = createTransactionResponse.get('Set-Cookie')

        const summaryResponse = await request(app.server)
            .post('/transactions')
            .set('Cookie', (cookies as any))
            .send({
                title: 'Debit transaction',
                amount: 2000,
                type: 'debit'
            })
            .expect(201)

        const listTransactionsResponse: any = await request(app.server)
            .get('/transactions/sumary')
            .set('Cookie', (cookies as any))
            .expect(200)

        expect(listTransactionsResponse.body.sumary).toEqual({
             amount: 3000,
        }
           
        )
    })


})

