import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function transactionsRoutes(app: FastifyInstance) {

  // Handler global: Dispara nesse contexto ao executar
  app.addHook('preHandler', async(request,reply) =>{
    console.log(`[${request.method}]  ${request.url}`)
  })

  // listando todas as transações
  // executando um middlare de verificação de sessão
  app.get('/', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const { sessionId } = request.cookies

    const transactions = await knex('transactions')
      .where('session_id', sessionId)
      .select()
    return {
      transactions
    }
  })

  // resumo das transações
  app.get('/sumary',  {
    preHandler: [checkSessionIdExists]
  }, async (request) => {
    const { sessionId } = request.cookies
    const sumary = await knex('transactions')
    .where('session_id', sessionId)
    .sum('amount', { as: 'amout' })
    .first()
    return { sumary }
  })

  // listando uma unica transação
  app.get('/:id', {
    preHandler: [checkSessionIdExists]
  }, async (request) => {
    const { sessionId } = request.cookies
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    const transaction = await knex('transactions')
    .where({
      session_id: sessionId,
      id,
    })
    
    .first()

    return { transaction }
  })



  // criando transação
  app.post('/', async (request, reply) => {
    // formato da resiquição validado
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    // adicionado os cookies
    let sessionId = request.cookies.sessionId
    if (!sessionId) {
      sessionId = randomUUID()
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 4  // 7 days, miliseconds
      })
    }

    // pegando os pedaços
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    // registrando no banco de dados
    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId
    })

    return reply.status(201).send()
  })
}