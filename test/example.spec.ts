import {test, beforeAll, afterAll} from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

beforeAll(async () =>{
    await app.ready()
})

afterAll(async () =>{
    await app.close()
})

test('user create transaction', async () =>{
    await request(app.server)
    .post('/transactions')
    .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
    })
    .expect(201)

    // or expect(response.statusCode).toEqual(201)
    
})