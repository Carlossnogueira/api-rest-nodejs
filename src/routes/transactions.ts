import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'

export async function transactionsRoutes(app: FastifyInstance) {
  
  // listando todas as transações
  app.get('/', async() =>{
    const transactions = await knex('transactions').select()
    return {
      transactions
    }
  })

  // resumo das transações
  app.get('/sumary', async () =>{
    const sumary = await knex('transactions').sum('amount', {as:'amout'}).first()
    return { sumary }
  })

  // listando uma unica transação
  app.get('/:id', async(request) =>{
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions').where('id',id).first()

    return { transaction }
  })

  app.post('/', async (request, reply) => {
    // formato da resiquição validado
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    // pegando os pedados
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    // registrando no banco de dados
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    return reply.status(201).send()
  })
}