const pg = require('pg')
const QueryStream = require('pg-query-stream')
const { fastifyStreamToCsv } = require('../../')

const connectionString = 'postgres://postgres:password@0.0.0.0:5432/postgres?sslmode=disable'

module.exports = async function (fastify, options) {
  fastify.register(fastifyStreamToCsv)

  fastify.get('/db-report', async function (req, reply) {
    // create a readable stream
    const stream = new QueryStream('SELECT * FROM generate_series(0, $1) num', [10000])
    const client = new pg.Client({ connectionString })
    await client.connect()
    const readStream = client.query(stream)

    // create a row formatter
    const rowFormatter = row => {
      const { num } = row
      return [`a${num}`, `b${num}`, `c${num}`]
    }

    // these are fast-csv format options
    const csvOptions = {
      delimiter: '\t',
      headers: ['a', 'b', 'c']
    }

    // use reply decorator
    await reply
      .header('Content-disposition', 'attachment; filename=postgres-example.csv')
      .streamToCsv(readStream, rowFormatter, { csvOptions })

    // clean up
    await client.end()

    return reply
  })
}
