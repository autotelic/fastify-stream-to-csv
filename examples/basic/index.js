const { Readable } = require('stream')

const { fastifyStreamToCsv } = require('../../')

module.exports = async function csv (fastify, options) {
  fastify.register(fastifyStreamToCsv)

  fastify.get('/report', async function report (req, reply) {
    // create a readable stream
    const readStream = Readable.from(Array.from(Array(100000).keys()))

    // create a row formatter
    const rowFormatter = num => [`a${num}`, `b${num}`, `c${num}`]

    // these are fast-csv format options
    const csvOptions = {
      delimiter: '\t',
      headers: ['a', 'b', 'c']
    }

    // use reply decorator
    reply
      .header('Content-disposition', 'attachment; filename=basic-example.csv')
      .streamToCsv(readStream, rowFormatter, { csvOptions })

    return reply
  })
}
