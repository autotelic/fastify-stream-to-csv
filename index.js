'use strict'

const fp = require('fastify-plugin')
const { format } = require('@fast-csv/format')

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
  fastify: '3.x',
  name: 'fastify-stream-to-csv'
})
