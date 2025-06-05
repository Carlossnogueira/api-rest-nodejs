import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

/*
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
*/

const app = fastify()

app.register(transactionsRoutes,{
  prefix: '/transactions'
})



app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP Server Running! http://localhost:3333')
  })
