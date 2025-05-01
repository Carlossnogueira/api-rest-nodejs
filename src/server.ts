import fastify from 'fastify'
import crypto from 'node:crypto'
import {knex} from './database'
import {env} from './env'

const app = fastify()

app.get('/hello', async() => {
  const transaction = await knex('transactions').insert({
    id: crypto.randomUUID(),
    title: 'Transação de Teste',
    amount:1000,
  }).returning('*') // retorna todas as alterações
  
  return transaction
})

// 1. Apenas testando
app.get('/return', async() =>{
  const transactions = await knex('transactions').select('*')
  return transactions
})

// 2. Testando também
app.get('/especific', async () =>{
  const especific = await knex('transactions').where('amount',1000).select('*')
  return especific
})

app.get('/' ,async () =>{
  return "Hello world"
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running! http://localhost:3333')
  })
