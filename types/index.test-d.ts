import fastify, { FastifyInstance } from 'fastify'
// eslint-disable-next-line import/no-unresolved
import { expectAssignable, expectError } from 'tsd'

import fastifyStreamToCsv from '..'

const opt1 = {}

const opt2 = {
  csvOptions: {
    objectMode: true,
    delimiter: ',',
    rowDelimiter: '\n',
    quote: '"',
    escape: '"',
    quoteColumns: { column1: true },
    quoteHeaders: false,
    headers: ['header1', 'header2'],
    writeHeaders: true,
    includeEndRowDelimiter: false,
    writeBOM: false,
    alwaysWriteHeaders: true
  }
}

expectAssignable<FastifyInstance>(fastify().register(fastifyStreamToCsv, opt1))
expectAssignable<FastifyInstance>(fastify().register(fastifyStreamToCsv, opt2))

const errOpt1 = {
  csvOptions: {
    invalidOption: 'invalid'
  }
}

const errOpt2 = {
  anotherInvalidKey: 'value'
}

expectError(fastify().register(fastifyStreamToCsv, errOpt1))
expectError(fastify().register(fastifyStreamToCsv, errOpt2))
