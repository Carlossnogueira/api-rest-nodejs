import { Knex } from "knex";
// migration never be edited! 

// create function
export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('transactions', (table) =>{
        table.uuid('id').primary()
        table.text('tittle').notNullable()
        table.decimal('amount',10,2).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    })
}

// if create functions don't work correctly, this function will do the reverse
export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('transactions')
}

