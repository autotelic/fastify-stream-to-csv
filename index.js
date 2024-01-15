'use strict'

const { format } = require('@fast-csv/format')
const fp = require('fastify-plugin')

async function replyDecorator (
  readStream,
  rowFormatter,
  options = {
    csvOptions: {}
  }
) {
  const { csvOptions } = options
  const writeStream = format(csvOptions)
  for await (const row of readStream) {
    writeStream.write(rowFormatter(row))
  }
  writeStream.end()
  this
    .type('text/csv')
    .send(writeStream)
}

const fastifyStreamToCsv = async (fastify, options) => {
  fastify.decorateReply('streamToCsv', replyDecorator)
}

module.exports = fp(fastifyStreamToCsv, {
  name: 'fastify-stream-to-csv'
})
