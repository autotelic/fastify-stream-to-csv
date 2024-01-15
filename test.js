const { Readable } = require('stream')

// eslint-disable-next-line import/no-unresolved
const test = require('ava')
// eslint-disable-next-line import/no-unresolved
const { parse } = require('csv-parse/sync')
const Fastify = require('fastify')
const supertest = require('supertest')

const { fastifyStreamToCsv } = require('./index')

test('Namespace should exist:', async (t) => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifyStreamToCsv)
  await fastify.ready()

  t.true(fastify.hasReplyDecorator('streamToCsv'), 'has streamToCsv reply decorator')
})

test('Should create a CSV file:', async (t) => {
  const fastify = Fastify()
  t.teardown(() => fastify.close())

  fastify.register(fastifyStreamToCsv)

  fastify.get('/', async function report (req, reply) {
    const readStream = Readable.from(Array.from(Array(1).keys()))

    const rowFormatter = num => [`a${num}`, `b${num}`, `c${num}`]

    await reply.streamToCsv(readStream, rowFormatter, {
      csvOptions: {
        headers: ['a', 'b', 'c']
      }
    })

    return reply
  })

  await fastify.ready()

  const response = await supertest(fastify.server)
    .get('/')
    .buffer()
    .parse((res, callback) => {
      res.setEncoding('binary')
      res.data = ''
      res.on('data', (chunk) => {
        res.data += chunk
      })
      res.on('end', () => {
        callback(null, Buffer.from(res.data, 'binary'))
      })
    })

  t.is(response.statusCode, 200)
  t.is(response.headers['content-type'], 'text/csv')
  t.not(response.headers['content-length'], 0)

  const csvResponse = parse(response.body)

  t.deepEqual(csvResponse, [
    ['a', 'b', 'c'],
    ['a0', 'b0', 'c0']
  ])
})
