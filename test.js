const test = require('ava')
const Fastify = require('fastify')
const supertest = require('supertest')
const { Readable } = require('stream')
const { parse } = require('csv-parse/sync')

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

  fastify.get('/', async function (req, reply) {
    const readStream = Readable.from(Array.from(Array(1).keys()))

    const rowFormatter = num => {
      return [`a${num}`, `b${num}`, `c${num}`]
    }

    reply.streamToCsv(readStream, rowFormatter, {
      csvOptions: {
        headers: ['a', 'b', 'c']
      }
    })
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
