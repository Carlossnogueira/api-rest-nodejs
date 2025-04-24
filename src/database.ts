import { knex as setupKnex, Knex } from 'knex'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
  useNullAsDefault: true, // null per default
  migrations:{
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
